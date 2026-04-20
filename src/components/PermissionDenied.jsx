/**
 * PermissionDenied Component
 * Shows 403 error page when user lacks required permissions
 * Provides helpful information and navigation options
 */

import React from 'react';
import { Container, Title, Text, Button, Stack, Center, ThemeIcon, Group } from '@mantine/core';
import { Warning, House, ArrowLeft } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';

const PermissionDenied = () => {
  const navigate = useNavigate();

  return (
    <Container size="sm" py={80}>
      <Center>
        <Stack align="center" spacing="lg">
          <ThemeIcon size={120} radius="md" variant="light" color="red">
            <Warning size={64} />
          </ThemeIcon>

          <Stack spacing="sm" align="center">
            <Title order={1} size="h2">
              403 - Access Denied
            </Title>
            <Text color="dimmed" align="center">
              You do not have permission to access this resource. If you believe this is an error,
              please contact your administrator.
            </Text>
          </Stack>

          <Group spacing="sm">
            <Button
              variant="default"
              leftIcon={<ArrowLeft size={16} />}
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
            <Button
              leftIcon={<House size={16} />}
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
          </Group>

          <Stack spacing="xs" mt="xl" style={{ width: '100%' }}>
            <Text size="sm" weight={500} color="dimmed">
              Common Reasons:
            </Text>
            <ul style={{ marginLeft: 20 }}>
              <li>
                <Text size="sm">You are not the Project PI (Principal Investigator)</Text>
              </li>
              <li>
                <Text size="sm">You do not have the required role for this action</Text>
              </li>
              <li>
                <Text size="sm">Your approval authority level is insufficient</Text>
              </li>
              <li>
                <Text size="sm">You are not a member of the required committee</Text>
              </li>
            </ul>
          </Stack>
        </Stack>
      </Center>
    </Container>
  );
};

export default PermissionDenied;
