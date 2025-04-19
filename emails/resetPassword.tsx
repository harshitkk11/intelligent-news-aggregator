import {
  Html,
  Head,
  Font,
  Preview,
  Section,
  Heading,
  Text,
  Body,
  Container,
  Img,
  Hr,
  Link,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  name: string;
  resetUrl: string;
}

export default function ResetPasswordEmail({
  name,
  resetUrl,
}: ResetPasswordEmailProps) {
  const firstName = name?.split(" ")[0];
  const logoUrl = process.env.LOGO_URL;

  return (
    <Html>
      <Head>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Reset your password</Preview>
      <Body>
        <Container>
          <Section
            style={{
              background: "black",
              color: "white",
              padding: "16px 0 16px 0",
            }}
          >
            <Img
              src={logoUrl}
              width="150"
              height="50"
              alt="Logo"
              style={{ margin: "auto" }}
            />
          </Section>

          <Section style={{ padding: "0 20px 0 20px" }}>
            <Heading as="h2">Hello {firstName},</Heading>

            <Text style={{ fontSize: "17.6px" }}>
              We received a request to reset your password. You can reset it by
              clicking the button below:
            </Text>

            <Section style={{ padding: "24px 0 24px 0", textAlign: "center" }}>
              <Link
                href={resetUrl}
                style={{
                  background: "#2563eb",
                  color: "white",
                  fontSize: "17.6px",
                  padding: "16px 20px 16px 20px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Reset Your Password
              </Link>
            </Section>

            <Text style={{ fontSize: "17.6px", textAlign: "start" }}>
              If the button above doesn&apos;t work, copy and paste the
              following link into your browser:
            </Text>

            <Text
              style={{
                padding: "0 16px 0 16px",
                fontSize: "17.6px",
                textAlign: "center",
                color: "#2563eb",
                wordBreak: "break-all",
              }}
            >
              {resetUrl}
            </Text>
          </Section>

          <Hr />

          <Section style={{ padding: "0 20px 0 20px" }}>
            <Text style={{ fontSize: "17.6px" }}>
              This link will expire in 1 hour. If you did not request a password
              reset, please ignore this email. Your account is safe, and no
              changes have been made.
            </Text>
          </Section>

          <Section
            style={{ background: "black", color: "white", padding: "20px" }}
          >
            <Text style={{ fontSize: "1.1rem", textAlign: "center" }}>
              If you have any questions or need assistance, please don&apos;t
              hesitate to contact us at{" "}
              <Link href="mailto:info@ina.com" style={{ color: "#93c5fd" }}>
                info@ina.com
              </Link>
              .
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
