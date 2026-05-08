import { Container, Title, Stack } from "@mantine/core";
import ProfileForm from "../components/ProfileForm";

export default function Profile() {
  return (
    <Container size="sm">
      <Stack gap="xl">
        <Title order={2}>User Profile</Title>
        <ProfileForm />
      </Stack>
    </Container>
  );
}
