import { Paper, Text, Group, Progress, Table, ScrollArea, SimpleGrid } from "@mantine/core";

const CATS = ["manpower","travel","contingency","consumables","equipments"];

export default function BudgetCard({ budget }) {
  if (!budget) return <Text c="dimmed" size="sm">No budget data available.</Text>;
  const utilized = Object.values(budget.expenditure_by_category || {}).reduce((a,b)=>a+b,0);
  const pct = budget.total_budget > 0 ? Math.min((utilized/budget.total_budget)*100, 100) : 0;

  return (
    <div>
      <SimpleGrid cols={4} mb="md">
        {[
          ["Total Budget", `₹${Number(budget.total_budget).toLocaleString()}`, "blue"],
          ["Current Funds", `₹${Number(budget.current_funds).toLocaleString()}`, "green"],
          ["Utilized", `₹${utilized.toLocaleString()}`, "red"],
          ["Overhead", `${budget.overhead}%`, "orange"],
        ].map(([label, value, color]) => (
          <Paper key={label} withBorder p="sm" radius="md">
            <Text size="xs" c="dimmed">{label}</Text>
            <Text fw={700} c={color}>{value}</Text>
          </Paper>
        ))}
      </SimpleGrid>

      <Text size="sm" fw={600} mb={4}>Budget Utilization: {pct.toFixed(1)}%</Text>
      <Progress value={pct} color={pct > 80 ? "red" : "green"} size="lg" radius="md" mb="md" />

      <Text size="sm" fw={600} mb="xs">Category Breakdown</Text>
      <ScrollArea>
        <Table withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Category</Table.Th>
              <Table.Th>Allotted (₹)</Table.Th>
              <Table.Th>Utilized (₹)</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {CATS.map(cat => {
              const allotted = budget[cat] ? Object.values(budget[cat]).reduce((a,b)=>a+Number(b),0) : 0;
              const used = budget.expenditure_by_category?.[cat.toUpperCase()] || 0;
              return (
                <Table.Tr key={cat}>
                  <Table.Td>{cat.charAt(0).toUpperCase()+cat.slice(1)}</Table.Td>
                  <Table.Td>₹{allotted.toLocaleString()}</Table.Td>
                  <Table.Td>₹{used.toLocaleString()}</Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </div>
  );
}
