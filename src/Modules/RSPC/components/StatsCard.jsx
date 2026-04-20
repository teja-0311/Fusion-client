import { Paper, Text, Group } from "@mantine/core";

export default function StatsCard({ label, value, color = "blue", icon }) {
  return (
    <Paper withBorder p="md" radius="md" style={{ flex: 1, minWidth: 140 }}>
      <Group justify="space-between" mb={4}>
        <Text size="xs" c="dimmed" fw={500}>{label}</Text>
        <Text size="xl">{icon}</Text>
      </Group>
      <Text fw={700} size="xl" c={color}>{value}</Text>
    </Paper>
  );
}
