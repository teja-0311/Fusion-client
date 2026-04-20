/**
 * FundRequests.jsx — Thin View
 * Write → services.request_fund          POST /research_procedures/api/funds/request/
 * Write → services.dean_approve_reject   POST /research_procedures/api/funds/<id>/dean-action/
 * Write → services.director_approve_fund POST /research_procedures/api/funds/<id>/director-approve/
 */
import { useState } from "react";
import { Tabs, NumberInput, Textarea, Button, Group, Title, Alert, Text, Stack } from "@mantine/core";
import { deanFundAction, directorApproveFund } from "./api";
import RSPCBreadcrumbs from "./components/RSPCBreadcrumbs";
import FundRequestForm from "./components/FundRequestForm";

export default function FundRequests() {
  const [activeTab, setActiveTab] = useState("0");
  const [fundId, setFundId]       = useState("");
  const [remarks, setRemarks]     = useState("");
  const [msg, setMsg]             = useState(null);

  const handleDean = async (action) => {
    if (!fundId) return setMsg({ type:"error", text:"Please enter a Fund Request ID." });
    setMsg(null);
    try {
      await deanFundAction(fundId, { action, remarks });
      setMsg({ type:"success", text:`Fund request ${action}d by Dean.` });
      setFundId(""); setRemarks("");
    } catch { setMsg({ type:"error", text:"Dean action failed." }); }
  };

  const handleDirector = async () => {
    if (!fundId) return setMsg({ type:"error", text:"Please enter a Fund Request ID." });
    setMsg(null);
    try {
      await directorApproveFund(fundId, {});
      setMsg({ type:"success", text:"Approved by Director." });
      setFundId(""); setRemarks("");
    } catch { setMsg({ type:"error", text:"Director approval failed." }); }
  };

  const tabItems = [
    {
      title: "Submit Request",
      component: (
        <FundRequestForm
          onSuccess={() => setMsg({ type:"success", text:"Fund request submitted." })}
        />
      ),
    },
    {
      title: "Dean / Director Actions",
      component: (
        <Stack gap="sm" maw={480}>
          <Text size="sm" c="dimmed">
            Enter the Fund Request ID to take an approval action.
          </Text>
          <NumberInput
            label="Fund Request ID"
            required
            value={fundId}
            onChange={v => setFundId(String(v))}
            placeholder="e.g. 12"
          />
          <Textarea
            label="Remarks"
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
            rows={3}
          />
          <Group gap="sm" wrap="wrap">
            <Button color="green" onClick={() => handleDean("approve")}>Dean Approve</Button>
            <Button color="red"   onClick={() => handleDean("reject")}>Dean Reject</Button>
            <Button color="grape" onClick={handleDirector}>Director Approve</Button>
          </Group>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <RSPCBreadcrumbs />
      <Title order={3} mt="md" mb="xs">Fund Requests</Title>
      {msg && (
        <Alert color={msg.type==="success"?"green":"red"} mb="sm"
          withCloseButton onClose={()=>setMsg(null)}>
          {msg.text}
        </Alert>
      )}
      <Tabs value={activeTab} onChange={v => { setActiveTab(v); setMsg(null); }}>
        <Tabs.List mb="md">
          {tabItems.map((t,i) => <Tabs.Tab key={i} value={String(i)}>{t.title}</Tabs.Tab>)}
        </Tabs.List>
        {tabItems.map((t,i) => <Tabs.Panel key={i} value={String(i)}>{t.component}</Tabs.Panel>)}
      </Tabs>
    </>
  );
}
