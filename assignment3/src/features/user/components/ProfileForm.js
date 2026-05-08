import { IconUser, IconMail, IconLock } from "@tabler/icons-react";
import { Paper, TextInput, Stack, Group, SimpleGrid } from "@mantine/core";
import { useForm } from "@mantine/form";
import UserAvatar from "../../../components/ui/UserAvatar";
import { isValidName } from "../../../utils/validationFunction";
import { SaveButton, PasswordButton } from "../../../components/ui/Buttons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../app/providers/AuthContext";
import { updateUser } from "../api";
import ShowErrorNotification from "@/components/ui/ShowErrorNotification";
import ShowNotification from "../../../components/ui/ShowNotification";

/**
 * ProfileForm component allows users to view and update their personal information.
 * It handles name updates and provides a link to the password change page.
 */
export default function ProfileForm() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Initialize form
  const form = useForm({
    initialValues: {
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      email: user?.email || "",
    },
    validate: {
      firstname: (value) => (isValidName(value) ? null : "Invalid first name"),
      lastname: (value) => (isValidName(value) ? null : "Invalid last name"),
    },
  });

  // Update form values when user data is loaded from AuthContext
  useEffect(() => {
    if (user) {
      form.setValues({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
      });
    }
  }, [user]);

  /**
   * Handles the profile update submission.
   * @param {Object} values - The validated form values.
   */
  const handleSave = async (values) => {
    setLoading(true);

    // Validate form values
    const validation = form.validate();
    if (validation.hasErrors) {
      setLoading(false);
      return;
    }

    try {
      await updateUser({
        firstname: values.firstname,
        lastname: values.lastname,
      });

      ShowNotification({
        id: "update-success",
        title: "Success",
        message: "Account updated successfully.",
        type: "success",
      });

      // refresh the user in the context
      await refreshUser();

      navigate("/quiz");
    } catch (errors) {
      ShowErrorNotification(errors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper withBorder p="xl" radius="md" shadow="sm">
      <Stack gap="lg" align="stretch">
        {/* Visual representation of the user */}
        <UserAvatar
          firstname={form.values.firstname}
          lastname={form.values.lastname}
        />

        {/* Name fields */}
        <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="md">
          <TextInput
            label="First Name"
            placeholder="Your first name"
            leftSection={<IconUser size={16} />}
            {...form.getInputProps("firstname")}
          />

          <TextInput
            label="Last Name"
            placeholder="Your last name"
            {...form.getInputProps("lastname")}
          />
        </SimpleGrid>

        {/* Read-only email field */}
        <TextInput
          label="Email Address"
          description="Email address cannot be changed"
          disabled
          leftSection={<IconMail size={16} />}
          {...form.getInputProps("email")}
        />

        <Group justify="flex-end" mt="md">
          <SaveButton
            loading={loading}
            disabled={loading}
            type="submit"
            onClick={form.onSubmit(handleSave)}
          />
        </Group>
      </Stack>
    </Paper>
  );
}
