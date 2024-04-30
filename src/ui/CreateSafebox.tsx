"use client"


import { Box, Button, TextField } from "@radix-ui/themes";
import { useState } from "react";

export default function CreateSafebox() {
  const [safeboxName, setSafeboxName] = useState("");
  const [safeboxPassword, setSafeboxPassword] = useState("");
  const {} = useCreateSafebox();

  return (<>
    <p>create a safebox</p>
    <Box width={"200px"}>
      <TextField.Root 
        placeholder="safebox name" 
        value={safeboxName}
        onChange={e => setSafeboxName(e.target.value)}
        type={"text"}
      />
    </Box>
    <Box width={"200px"}>
      <TextField.Root 
        placeholder="safebox password"
        value={safeboxPassword}
        onChange={e => setSafeboxPassword(e.target.value)}
        type={"password"}
      /> 
    </Box>
    <Button>create</Button>
  </>);
}

const useCreateSafebox = () => {
  const [isRunning, setIsRunning] = useState(false);
  return {
    isRunning,
    execute: (name: string, password: string) => {
      setIsRunning(true);
      
    }
  }
}