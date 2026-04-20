import { Stack, Paper, Text, Group, Badge, Button } from "@mantine/core";
import { markNotificationRead } from "../api";

export default function NotificationsList({ notifications = [], onRefresh }) {
  const handleRead = async (nid) => {
    try { await markNotificationRead(nid); onRefresh?.(); } catch (_) {}
  };

  if (!notifications.length) return <Text c="dimmed" size="sm">No notifications.</Text>;

  return (
    <Stack gap="sm">
      {notifications.map((n) => (
        <Paper key={n.nid} withBorder p="sm" radius="md"
          style={{ background: n.is_read ? undefined : "#eef5ff" }}>
          <Group justify="space-between" align="flex-start">
            <div style={{ flex: 1 }}>
              <Group gap="xs" mb={4}>
                <Text fw={n.is_read ? 400 : 700} size="sm">{n.title || n.subject || "Notification"}</Text>
                {!n.is_read && <Badge size="xs" color="blue">New</Badge>}
              </Group>
              <Text size="xs" c="dimmed">{n.message}</Text>
              <Text size="xs" c="dimmed" mt={4}>
                {new Date(n.created_at).toLocaleString()}
              </Text>
            </div>
            {!n.is_read && (
              <Button size="xs" variant="light" onClick={() => handleRead(n.nid)}>
                Mark Read
              </Button>
            )}
          </Group>
        </Paper>
      ))}
    </Stack>
  );
}
