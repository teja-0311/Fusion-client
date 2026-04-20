import { Table, Badge, Button, ScrollArea, Text } from "@mantine/core";

const STATUS_COLOR = {
  DRAFT: "gray",
  COMMITTEE_PENDING: "yellow",
  COMMITTEE_APPROVED: "lime",
  COMMITTEE_REJECTED: "red",
  HOD_PENDING: "orange",
  HOD_APPROVED: "cyan",
  HOD_REJECTED: "red",
  RSPC_PENDING: "grape",
  RSPC_APPROVED: "blue",
  RSPC_REJECTED: "red",
  APPOINTED: "green",
  REJECTED: "red",
  WITHDRAWN: "gray",
};

export default function StaffTable({
  staff = [],
  onAction,
  actionLabel = "Manage",
  actionColor = "blue",
  canAction = () => true,
}) {
  const renderStatus = (status) => (status || "DRAFT").replaceAll("_", " ");

  if (!staff.length) return <Text c="dimmed" size="sm">No staff records found.</Text>;
  return (
    <ScrollArea>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            {["ID", "Project", "Person", "Type", "Salary (₹)", "Duration (mo)", "Status", "Action"].map(h=>(
              <Table.Th key={h}>{h}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {staff.map(s => (
            <Table.Tr key={s.sid}>
              <Table.Td>{s.sid}</Table.Td>
              <Table.Td>{s.pid}</Table.Td>
              <Table.Td>{s.person}</Table.Td>
              <Table.Td>{s.type}</Table.Td>
              <Table.Td>₹{Number(s.salary).toLocaleString()}</Table.Td>
              <Table.Td>{s.duration}</Table.Td>
              <Table.Td>
                <Badge color={STATUS_COLOR[s.approval_status] || "gray"} variant="light">
                  {renderStatus(s.approval_status)}
                </Badge>
              </Table.Td>
              <Table.Td>
                {canAction(s) ? (
                  <Button size="xs" color={actionColor} variant="light" onClick={() => onAction?.(s)}>
                    {actionLabel}
                  </Button>
                ) : (
                  <Text c="dimmed" size="xs">-</Text>
                )}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
