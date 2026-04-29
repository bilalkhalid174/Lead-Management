import {
  Html,
  Body,
  Container,
  Text,
  Heading,
} from "@react-email/components";

type Props = {
  leadName: string;
  oldStatus: string;
  newStatus: string;
};

export default function LeadStatusChangeEmail({
  leadName,
  oldStatus,
  newStatus,
}: Props) {
  return (
    <Html>
      <Body>
        <Container>
          <Heading>Lead Status Updated</Heading>

          <Text>
            Lead Name: <b>{leadName}</b>
          </Text>

          <Text>Status changed:</Text>

          <Text>
            <b>{oldStatus}</b> → <b>{newStatus}</b>
          </Text>

          <Text>This is an automated notification from your CRM system.</Text>
        </Container>
      </Body>
    </Html>
  );
}