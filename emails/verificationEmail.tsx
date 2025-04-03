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
  
  interface VerificationEmailProps {
    name: string;
    verificationCode: string;
  }
  
  export default function VerificationEmail({
    name,
    verificationCode,
  }: VerificationEmailProps) {
    const firstName = name?.split(" ")[0];
    const logoUrl = "/next.svg"; // TODO: Website logo url
  
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
        <Preview>Your verification code is {verificationCode}</Preview>
        <Body>
          <Container>
            <Section
              style={{
                background: "black",
                color: "white",
                padding: "15px 0",
              }}
            >
              <Img
                src={logoUrl}
                width="150"
                height="50"
                alt="WebLooop's Logo"
                style={{
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              />
            </Section>
  
            <Section style={{ padding: "0 20px" }}>
              <Heading as="h2">Hello {firstName},</Heading>
  
              <Text style={{ fontSize: "1.1rem" }}>
                Thank you for signing up for our platform. To complete your
                sign-up and start exploring, please verify your email address.
                Enter the verification code below:
              </Text>
  
              <Section style={{ textAlign: "center" }}>
                <Text style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                  Verification code
                </Text>
  
                <Text
                  style={{
                    fontSize: "3.5rem",
                    fontWeight: "bolder",
                    padding: "12px 0",
                  }}
                >
                  {verificationCode}
                </Text>
  
                <Text style={{ fontSize: "1.1rem" }}>
                  (This code is valid for the next 15 minutes)
                </Text>
              </Section>
            </Section>
  
            <Hr />
  
            <Section style={{ padding: "20px" }}>
              <Text style={{ fontSize: "1.1rem" }}>
                Please do not share this code with anyone. Intelligent News Aggregator will never ask
                for your verification code.
              </Text>
            </Section>
            <Section
              style={{ background: "black", color: "white", padding: "20px" }}
            >
              <Text style={{ fontSize: "1.1rem", textAlign: "center" }}>
                If you didn&apos;t request this verification email, please ignore
                this message. If you have any questions, please contact us at{" "}
                <Link
                  href="mailto:info@ina.com" // link to the email address
                  style={{ color: "#93c5fd" }}
                >
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