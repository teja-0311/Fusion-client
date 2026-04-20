import { Table, Badge, Button, ScrollArea, Text, Group } from "@mantine/core";

const STATUS_COLOR = {
  ONGOING: "green", COMPLETED: "blue", PROPOSED: "yellow",
  SANCTIONED: "grape", REJECTED: "red", TERMINATED: "gray",
  UNDER_REVIEW: "teal", DEFAULT: "gray",
};

export default function ProjectsTable({ projects = [], onView, onEdit }) {
  if (!projects.length) return <Text c="dimmed" size="sm">No projects found.</Text>;
  return (
    <ScrollArea>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            {["#", "Name", "PI", "Dept", "Agency", "Budget (₹)", "Status", "Action"].map(h => (
              <Table.Th key={h}>{h}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {projects.map((p) => (
            <Table.Tr key={p.pid}>
              <Table.Td>{p.pid}</Table.Td>
              <Table.Td>{p.name}</Table.Td>
              <Table.Td>{p.pi_name}</Table.Td>
              <Table.Td>{p.dept}</Table.Td>
              <Table.Td>{p.sponsored_agency}</Table.Td>
              <Table.Td>₹{Number(p.total_budget).toLocaleString()}</Table.Td>
              <Table.Td>
                <Badge color={STATUS_COLOR[p.status] || STATUS_COLOR.DEFAULT} variant="light">
                  {p.status}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <Button size="xs" variant="light" onClick={() => onView?.(p.pid)}>
                    View
                  </Button>
                  {p.available_actions?.can_edit && (
                    <Button size="xs" color="orange" variant="light" onClick={() => onEdit?.(p)}>
                      Edit
                    </Button>
                  )}
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
