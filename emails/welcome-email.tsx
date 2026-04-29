import {
  Html,
  Body,
  Container,
  Text,
  Heading,
} from "@react-email/components";

type Props = {
  name: string;
};

export default function WelcomeEmail({ name }: Props) {
  return (
    <Html>
      <Body>
        <Container>
          <Heading>Welcome 🎉</Heading>
          <Text>Hello {name},</Text>
          <Text>Welcome to our platform.</Text>
        </Container>
      </Body>
    </Html>
  );
}