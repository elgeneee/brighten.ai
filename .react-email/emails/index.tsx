import { Section } from "@react-email/section";
import { Container } from "@react-email/container";
import { Head } from "@react-email/head";
import { Img } from "@react-email/img";
import { Heading } from "@react-email/heading";
import { Html } from "@react-email/html";
import { Text } from "@react-email/text";
import { Link } from "@react-email/link";
import { Preview } from "@react-email/preview";

import * as React from "react";

interface EmailProps {
  recipient: string;
  image: string;
}
export default function Email() {
  return (
    <Html lang="en">
      <Head />
      <Preview>Download your image result here!</Preview>
      <Section style={main}>
        <Container style={container}>
          <Section className="mt-32">
            <Img
              src="https://miro.medium.com/v2/resize:fit:786/format:webp/1*8T7pwamc162n_dR8caUJwA.jpeg"
              alt="Cat"
              width={40}
              style={logo}
            />
          </Section>
          <Heading style={h1}>
            <strong>Brighten.ai</strong>
          </Heading>
          <Text style={text}>Hello eedren,</Text>
          <Text style={text}>
            Thank you for using <Link href="brighten.ai">Brighten.ai</Link>, you
            may download your image below:
          </Text>
          <Text style={text}>
            Best, <br />
            Brighten.ai team
          </Text>
        </Container>
      </Section>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  margin: "0 auto",
};

const logo = {
  margin: "0 auto",
};

const h1 = {
  color: "#000",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "24px",
  fontWeight: "normal",
  textAlign: "center" as const,
  margin: "30px 0",
  padding: "0",
};

const container = {
  border: "1px solid #eaeaea",
  backgroundColor: "#fff",
  borderRadius: "5px",
  margin: "40px auto",
  padding: "20px",
  width: "465px",
};

const text = {
  color: "#000",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  lineHeight: "24px",
};
