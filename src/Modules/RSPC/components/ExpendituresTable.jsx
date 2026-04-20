import { Table, Badge, Button, Group, ScrollArea, Text } from "@mantine/core";
import { approveExpenditure, rejectExpenditure } from "../api";
import { notifications } from "@mantine/notifications";

const STATUS_COLOR = { PENDING:"yellow", PI_APPROVED:"blue", HOD_APPROVED:"grape", APPROVED:"green", REJECTED:"red" };

export default function ExpendituresTable({ expenditures = [], onRefresh }) {
  if (!expenditures.length) return <Text c="dimmed" size="sm">No expenditure records.</Text>;

  const handle = async (fn, eid, label) => {
    try {
      await fn(eid, {});
      notifications.show({ message:`Expenditure ${label}d`, color: label==="approve"?"green":"red" });
      onRefresh?.();
    } catch { notifications.show({ message:"Action failed", color:"red" }); }
  };

  return (
    <ScrollArea>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            {["ID","Project","Category","Amount (₹)","Purpose","Status","Approver","Actions"].map(h=>(
              <Table.Th key={h}>{h}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {expenditures.map(e => (
            <Table.Tr key={e.eid}>
              <Table.Td>{e.eid}</Table.Td>
              <Table.Td>{e.project?.name || e.project}</Table.Td>
              <Table.Td>{e.category}</Table.Td>
              <Table.Td>₹{Number(e.amount).toLocaleString()}</Table.Td>
              <Table.Td style={{maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{e.purpose}</Table.Td>
              <Table.Td><Badge color={STATUS_COLOR[e.status]||"gray"} variant="light">{e.status}</Badge></Table.Td>
              <Table.Td>{e.current_approver||"—"}</Table.Td>
              <Table.Td>
                {e.status==="PENDING" && (
                  <Group gap={4}>
                    <Button size="xs" color="green" variant="light" onClick={()=>handle(approveExpenditure,e.eid,"approve")}>Approve</Button>
                    <Button size="xs" color="red"   variant="light" onClick={()=>handle(rejectExpenditure,e.eid,"reject")}>Reject</Button>
                  </Group>
                )}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
