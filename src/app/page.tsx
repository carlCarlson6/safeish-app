import CreateSafebox from "@/ui/CreateSafebox";
import { Box, Button, Flex, TextField } from "@radix-ui/themes";

export default function Home() {
  return (
    <main>
      <Flex align={"center"} direction={"column"} gap={"2"} >
        <CreateSafebox />
      </Flex>
    </main>
  );
}
