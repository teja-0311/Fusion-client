import { Table, Text, ScrollArea } from "@mantine/core";

export default function RecentActivityTable({ activities = [] }) {
  if (!activities.length) return <Text c="dimmed" size="sm">No recent activity.</Text>;
  return (
    <ScrollArea>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Type</Table.Th>
            <Table.Th>Subject</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Remarks</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {activities.map((a, i) => (
            <Table.Tr key={i}>
              <Table.Td>{a.type}</Table.Td>
              <Table.Td>{a.subject}</Table.Td>
              <Table.Td>{new Date(a.date).toLocaleDateString()}</Table.Td>
              <Table.Td>{a.remarks || "—"}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
