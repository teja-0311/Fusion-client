/**
 * RSPC Dashboard Component
 * Role-based dashboard showing different content based on user's RSPC role
 * - RSPC Admin: System overview, all projects, all approvals
 * - HOD: Department projects, expenditure approvals, staff requests
 * - PI: My projects, my expenditures, my staff requests, pending approvals
 */

import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  Title,
  Text,
  Badge,
  Stack,
  Group,
  Button,
  Loader,
  Alert,
  Tabs,
  Table,
} from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowUpRight,
  CheckCircle,
  Clock,
  AlertCircle,
  FolderOpen,
  Users,
} from 'phosphor-react';
import { setRSPCRoles, setRSPCApprovals } from '../redux/userslice';
import rspcRoleService, { getRoleDisplayName } from '../helper/rspcRoleService';
import PermissionGuard from './PermissionGuard';
import RoleIndicator from './RoleIndicator';

const RSPCDashboard = () => {
  const dispatch = useDispatch();
  const rspcRoles = useSelector((state) => state.user.rspcRoles);
  const rspcApprovals = useSelector((state) => state.user.rspcApprovals);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [myProjects, setMyProjects] = useState([]);
  const [staffRequests, setStaffRequests] = useState([]);

  // Load roles and data on mount
  useEffect(() => {
    const loadRolesAndData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get user's RSPC roles
        const roles = await rspcRoleService.getRSPCRoles();
        dispatch(setRSPCRoles(roles));

        // Get pending approvals
        try {
          const approvals = await rspcRoleService.getPendingApprovals();
          dispatch(setRSPCApprovals(approvals));
        } catch (err) {
          console.log('Could not load approvals:', err);
        }

        // Get my projects if PI
        if (roles.is_pi) {
          try {
            const projects = await rspcRoleService.getMyProjects();
            setMyProjects(projects);
          } catch (err) {
            console.log('Could not load projects:', err);
          }
        }

        // Get staff requests if HOD/RSPC Admin
        if (roles.is_hod || roles.is_rspc_admin) {
          try {
            const staff = await rspcRoleService.getPendingStaffRequests();
            setStaffRequests(staff);
          } catch (err) {
            console.log('Could not load staff requests:', err);
          }
        }
      } catch (err) {
        setError(err.message);
        console.error('Failed to load RSPC dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRolesAndData();
  }, [dispatch]);

  if (loading) {
    return (
      <Container size="lg" py="xl">
        <Group position="center" mt="xl">
          <Loader />
        </Group>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="lg" py="xl">
        <Alert icon={<AlertCircle />} color="red" title="Error">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      {/* Header with role indicator */}
      <Group position="apart" mb="xl">
        <div>
          <Title order={1} mb="xs">
            RSPC Module Dashboard
          </Title>
          <Text color="dimmed">
            Welcome! You are accessing as: <strong>{getRoleDisplayName(rspcRoles)}</strong>
          </Text>
        </div>
        <RoleIndicator rspcRoles={rspcRoles} />
      </Group>

      {/* RSPC Admin Dashboard */}
      <PermissionGuard requiredRoles={['rspc_admin']} rspcRoles={rspcRoles}>
        <AdminDashboard approvals={rspcApprovals} staffRequests={staffRequests} />
      </PermissionGuard>

      {/* HOD Dashboard */}
      <PermissionGuard requiredRoles={['hod']} rspcRoles={rspcRoles}>
        <HODDashboard
          department={rspcRoles.department}
          approvals={rspcApprovals}
          staffRequests={staffRequests}
        />
      </PermissionGuard>

      {/* PI Dashboard */}
      <PermissionGuard requiredRoles={['pi']} rspcRoles={rspcRoles}>
        <PIDashboard projects={myProjects} approvals={rspcApprovals} />
      </PermissionGuard>

      {/* Guest/Faculty Dashboard - No access */}
      {!rspcRoles.is_pi && !rspcRoles.is_hod && !rspcRoles.is_rspc_admin && (
        <Alert icon={<AlertCircle />} color="yellow" title="Limited Access">
          You do not have RSPC module access. Please contact your administrator if you believe this
          is an error.
        </Alert>
      )}
    </Container>
  );
};

/**
 * Admin Dashboard - System-wide view
 */
const AdminDashboard = ({ approvals, staffRequests }) => {
  return (
    <div>
      <Title order={2} mb="lg">
        System Administrator Dashboard
      </Title>

      <Grid mb="xl">
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Group position="apart" mb="xs">
              <Text weight={500}>Pending Approvals</Text>
              <Clock size={20} color="blue" />
            </Group>
            <Title order={2}>{approvals?.length || 0}</Title>
            <Text size="sm" color="dimmed">
              Expenditures awaiting approval
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Group position="apart" mb="xs">
              <Text weight={500}>Staff Requests</Text>
              <Users size={20} color="green" />
            </Group>
            <Title order={2}>{staffRequests?.length || 0}</Title>
            <Text size="sm" color="dimmed">
              Staff requests requiring action
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Button fullWidth>View All Projects</Button>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Button fullWidth>Create Project</Button>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Pending Approvals Table */}
      {approvals && approvals.length > 0 && (
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Title order={3} mb="md">
            Pending Expenditure Approvals
          </Title>
          <Table striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Project</Table.Th>
                <Table.Th>Amount</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Action</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {approvals.map((approval) => (
                <Table.Tr key={approval.id}>
                  <Table.Td>{approval.project_name || 'N/A'}</Table.Td>
                  <Table.Td>₹ {approval.amount?.toLocaleString()}</Table.Td>
                  <Table.Td>
                    <Badge>{approval.status}</Badge>
                  </Table.Td>
                  <Table.Td>
                    <Button size="xs">Review</Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      )}
    </div>
  );
};

/**
 * HOD Dashboard - Department-specific view
 */
const HODDashboard = ({ department, approvals, staffRequests }) => {
  return (
    <div>
      <Title order={2} mb="lg">
        Department Head Dashboard - {department || 'N/A'}
      </Title>

      <Grid mb="xl">
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Group position="apart" mb="xs">
              <Text weight={500}>Pending Approvals</Text>
              <Clock size={20} color="blue" />
            </Group>
            <Title order={2}>{approvals?.length || 0}</Title>
            <Text size="sm" color="dimmed">
              Expenditures awaiting your approval
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Group position="apart" mb="xs">
              <Text weight={500}>Staff Requests</Text>
              <Users size={20} color="green" />
            </Group>
            <Title order={2}>{staffRequests?.length || 0}</Title>
            <Text size="sm" color="dimmed">
              Staff requests from PIs
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Button fullWidth>View Department Projects</Button>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Pending Approvals */}
      {approvals && approvals.length > 0 && (
        <Card shadow="sm" p="lg" radius="md" withBorder mb="xl">
          <Title order={3} mb="md">
            Expenditure Approvals Pending
          </Title>
          <Table striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Project</Table.Th>
                <Table.Th>PI</Table.Th>
                <Table.Th>Amount</Table.Th>
                <Table.Th>Action</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {approvals.map((approval) => (
                <Table.Tr key={approval.id}>
                  <Table.Td>{approval.project_name || 'N/A'}</Table.Td>
                  <Table.Td>{approval.pi_name || 'N/A'}</Table.Td>
                  <Table.Td>₹ {approval.amount?.toLocaleString()}</Table.Td>
                  <Table.Td>
                    <Button size="xs">Review</Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      )}
    </div>
  );
};

/**
 * PI Dashboard - Personal project-focused view
 */
const PIDashboard = ({ projects, approvals }) => {
  return (
    <div>
      <Title order={2} mb="lg">
        Principal Investigator Dashboard
      </Title>

      <Grid mb="xl">
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Group position="apart" mb="xs">
              <Text weight={500}>My Projects</Text>
              <FolderOpen size={20} color="blue" />
            </Group>
            <Title order={2}>{projects?.length || 0}</Title>
            <Text size="sm" color="dimmed">
              Active research projects
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Group position="apart" mb="xs">
              <Text weight={500}>Pending Approvals</Text>
              <Clock size={20} color="orange" />
            </Group>
            <Title order={2}>{approvals?.length || 0}</Title>
            <Text size="sm" color="dimmed">
              Your expenditures awaiting approval
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Button fullWidth>Submit Expenditure</Button>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Button fullWidth>Request Staff</Button>
          </Card>
        </Grid.Col>
      </Grid>

      {/* My Projects */}
      {projects && projects.length > 0 && (
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Title order={3} mb="md">
            My Research Projects
          </Title>
          <Table striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Project Title</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Duration</Table.Th>
                <Table.Th>Action</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {projects.map((project) => (
                <Table.Tr key={project.id}>
                  <Table.Td>{project.title}</Table.Td>
                  <Table.Td>
                    <Badge>{project.status}</Badge>
                  </Table.Td>
                  <Table.Td>{project.duration || 'N/A'} months</Table.Td>
                  <Table.Td>
                    <Button size="xs">View</Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      )}
    </div>
  );
};

export default RSPCDashboard;
