import {
  Html,
  Body,
  Container,
  Text,
  Heading,
  Tailwind,
} from "@react-email/components";

type Props = {
  name: string;
};

export default function WelcomeEmail({ name }: Props) {
  return (
    <Html>
      <Tailwind>
        <Body className="bg-white font-sans text-gray-800">
          <Container className="mx-auto p-4">
            <Heading className="text-2xl font-semibold mb-4">Welcome 🎉</Heading>
            <Text className="text-base mb-2">Hello {name},</Text>
            <Text className="text-base mb-4">
              Welcome to our platform. We are thrilled to have you with us. Your account is fully set up, and you can now start managing your leads seamlessly.
            </Text>
            <Text className="text-sm text-gray-500 mt-6">
              Best regards,<br />
              The Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}