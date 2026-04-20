/**
 * RSPCForm Component - Base Form with Role-Based Field Visibility
 * Dynamically shows/hides fields based on user's RSPC role
 * Implements business rule validations
 * 
 * Usage:
 * <RSPCForm
 *   formType="expenditure"
 *   rspcRoles={roles}
 *   onSubmit={handleSubmit}
 *   projectId={123}
 * />
 */

import React, { useState } from 'react';
import {
  Form,
  Input,
  NumberInput,
  Select,
  Textarea,
  Button,
  Group,
  Stack,
  Alert,
  Card,
  Badge,
  Text,
  Divider,
} from '@mantine/core';
import { AlertCircle, CheckCircle } from 'phosphor-react';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

/**
 * Expenditure Submission Form - Role-Based
 * Only available to PI and Co-PI
 * Different approval chains based on amount
 */
export const ExpenditureForm = ({ rspcRoles, projectId, onSuccess }) => {
  const [formData, setFormData] = useState({
    expenditure_type: 'Equipment',
    amount: '',
    description: '',
    justification: '',
    vendor_name: '',
    reference_documents: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [estimatedApprovers, setEstimatedApprovers] = useState(null);

  // Check permission
  if (!rspcRoles?.is_pi) {
    return (
      <Alert icon={<AlertCircle />} color="red" title="Access Denied">
        Only Principal Investigators (PIs) can submit expenditure requests.
      </Alert>
    );
  }

  const handleAmountChange = (value) => {
    setFormData({ ...formData, amount: value });

    // Estimate approval chain based on amount
    let approvers = [];
    if (value <= 50000) {
      approvers = ['You (PI)'];
    } else if (value <= 200000) {
      approvers = ['You (PI)', 'HOD (Your Department)', 'RSPC Admin'];
    } else {
      approvers = ['You (PI)', 'HOD (Your Department)', 'RSPC Admin'];
    }
    setEstimatedApprovers(approvers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('authToken');
      await axios.post(
        `${API_BASE}/rspc/expenditures/`,
        {
          ...formData,
          project_id: projectId,
        },
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setFormData({
        expenditure_type: 'Equipment',
        amount: '',
        description: '',
        justification: '',
        vendor_name: '',
        reference_documents: null,
      });

      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit expenditure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Card.Section inheritPadding py="md">
        <Text weight={500} size="lg">
          Submit Expenditure Request
        </Text>
        <Text size="sm" color="dimmed">
          Submit new expenditure for your research project
        </Text>
      </Card.Section>

      <Divider />

      <Card.Section inheritPadding py="md">
        <form onSubmit={handleSubmit}>
          <Stack spacing="md">
            {error && (
              <Alert icon={<AlertCircle />} color="red" title="Error">
                {error}
              </Alert>
            )}

            <Select
              label="Expenditure Type"
              placeholder="Select type"
              data={['Equipment', 'Manpower', 'Consumables', 'Travel', 'Other']}
              value={formData.expenditure_type}
              onChange={(value) => setFormData({ ...formData, expenditure_type: value })}
              required
            />

            <NumberInput
              label="Amount (₹)"
              placeholder="Enter amount"
              min={0}
              value={formData.amount}
              onChange={handleAmountChange}
              required
              description={
                estimatedApprovers ? (
                  <div>
                    <Text size="xs" weight={500} mt="xs">
                      Approval Chain:
                    </Text>
                    <Group spacing="xs">
                      {estimatedApprovers.map((approver, idx) => (
                        <Badge key={idx} size="sm" variant="light">
                          {approver}
                        </Badge>
                      ))}
                    </Group>
                  </div>
                ) : null
              }
            />

            <Input
              label="Vendor Name"
              placeholder="Enter vendor name"
              value={formData.vendor_name}
              onChange={(e) => setFormData({ ...formData, vendor_name: e.currentTarget.value })}
              required
            />

            <Textarea
              label="Description"
              placeholder="Detailed description of expenditure"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.currentTarget.value })}
              required
              minRows={3}
            />

            <Textarea
              label="Justification"
              placeholder="Why is this expenditure needed?"
              value={formData.justification}
              onChange={(e) => setFormData({ ...formData, justification: e.currentTarget.value })}
              required
              minRows={3}
            />

            <Group position="right" mt="md">
              <Button variant="default" type="reset">
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Submit for Approval
              </Button>
            </Group>
          </Stack>
        </form>
      </Card.Section>
    </Card>
  );
};

/**
 * Staff Request Form - PI Only
 * Allows PI to request additional staff for projects
 */
export const StaffRequestForm = ({ rspcRoles, projectId, onSuccess }) => {
  const [formData, setFormData] = useState({
    staff_type: 'Research Associate',
    duration: '',
    justification: '',
    required_qualifications: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!rspcRoles?.is_pi) {
    return (
      <Alert icon={<AlertCircle />} color="red" title="Access Denied">
        Only Principal Investigators (PIs) can request staff.
      </Alert>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('authToken');
      await axios.post(
        `${API_BASE}/rspc/staff/`,
        {
          ...formData,
          project_id: projectId,
        },
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setFormData({
        staff_type: 'Research Associate',
        duration: '',
        justification: '',
        required_qualifications: '',
      });

      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to request staff');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Card.Section inheritPadding py="md">
        <Text weight={500} size="lg">
          Request Additional Staff
        </Text>
        <Text size="sm" color="dimmed">
          Request research staff for your project
        </Text>
      </Card.Section>

      <Divider />

      <Card.Section inheritPadding py="md">
        <form onSubmit={handleSubmit}>
          <Stack spacing="md">
            {error && (
              <Alert icon={<AlertCircle />} color="red" title="Error">
                {error}
              </Alert>
            )}

            <Select
              label="Staff Type"
              placeholder="Select staff type"
              data={['Research Associate', 'Senior Research Fellow', 'Junior Research Fellow', 'Project Engineer']}
              value={formData.staff_type}
              onChange={(value) => setFormData({ ...formData, staff_type: value })}
              required
            />

            <NumberInput
              label="Duration (Months)"
              placeholder="How many months?"
              min={1}
              max={60}
              value={formData.duration}
              onChange={(value) => setFormData({ ...formData, duration: value })}
              required
              description="Minimum 1 month, Maximum 60 months (BR-RSPC-11)"
            />

            <Textarea
              label="Justification"
              placeholder="Why do you need this staff position?"
              value={formData.justification}
              onChange={(e) => setFormData({ ...formData, justification: e.currentTarget.value })}
              required
              minRows={3}
            />

            <Textarea
              label="Required Qualifications"
              placeholder="Educational and technical qualifications required"
              value={formData.required_qualifications}
              onChange={(e) => setFormData({ ...formData, required_qualifications: e.currentTarget.value })}
              required
              minRows={2}
            />

            <Group position="right" mt="md">
              <Button variant="default" type="reset">
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Submit Request
              </Button>
            </Group>
          </Stack>
        </form>
      </Card.Section>
    </Card>
  );
};

/**
 * Expenditure Approval Form - Approvers Only
 * HOD and RSPC Admin use this to approve expenditure requests
 */
export const ExpenditureApprovalForm = ({ expenditureId, currentApprover, rspcRoles, onSuccess }) => {
  const [formData, setFormData] = useState({
    verdict: 'approved',
    comments: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is authorized to approve
  const canApprove = () => {
    return rspcRoles?.is_hod || rspcRoles?.is_rspc_admin;
  };

  if (!canApprove()) {
    return (
      <Alert icon={<AlertCircle />} color="red" title="Access Denied">
        Only HOD or RSPC Admin can approve expenditures.
      </Alert>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('authToken');
      await axios.post(
        `${API_BASE}/rspc/expenditures/${expenditureId}/approve/`,
        formData,
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setFormData({
        verdict: 'approved',
        comments: '',
      });

      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to approve expenditure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder border="2px solid">
      <Card.Section inheritPadding py="md">
        <Text weight={500} size="lg">
          Approve Expenditure Request
        </Text>
        <Text size="sm" color="dimmed">
          Current Approver: {currentApprover}
        </Text>
      </Card.Section>

      <Divider />

      <Card.Section inheritPadding py="md">
        <form onSubmit={handleSubmit}>
          <Stack spacing="md">
            {error && (
              <Alert icon={<AlertCircle />} color="red" title="Error">
                {error}
              </Alert>
            )}

            <Select
              label="Verdict"
              placeholder="Select verdict"
              data={[
                { value: 'approved', label: 'Approve' },
                { value: 'rejected', label: 'Reject' },
                { value: 'pending_revision', label: 'Request Revision' },
              ]}
              value={formData.verdict}
              onChange={(value) => setFormData({ ...formData, verdict: value })}
              required
            />

            <Textarea
              label="Comments"
              placeholder={
                formData.verdict === 'rejected'
                  ? 'Please explain why you are rejecting this request'
                  : 'Add any comments or conditions for approval'
              }
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.currentTarget.value })}
              minRows={3}
            />

            <Group position="right" mt="md">
              <Button variant="default" type="reset">
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                color={formData.verdict === 'approved' ? 'green' : 'red'}
              >
                {formData.verdict === 'approved' ? 'Approve' : 'Reject'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Card.Section>
    </Card>
  );
};

export default {
  ExpenditureForm,
  StaffRequestForm,
  ExpenditureApprovalForm,
};
