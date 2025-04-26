import * as React from "react";
import { Html, Head, Preview, Body, Container, Text, Heading, Section } from "@react-email/components";

export const EmailTemplate = ({ userName, type, data }) => {
  return (
    <Html>
      <Head />
      <Preview>Your monthly report summary</Preview>
      <Body style={styles.main}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>Monthly Report Summary</Heading>
          <Text style={styles.text}>Hello {userName},</Text>
          <Text style={styles.text}>Here's your {type} summary:</Text>

          {/* Main Stats */}
          <Section style={styles.statsContainer}>
            <div style={styles.stat}>
              <Text style={styles.text}>Total Income</Text>
              <Text style={styles.heading}>${data?.stats?.totalIncome || 0}</Text>
            </div>
            <div style={styles.stat}>
              <Text style={styles.text}>Total Expenses</Text>
              <Text style={styles.heading}>${data?.stats?.totalExpenses || 0}</Text>
            </div>
            <div style={styles.stat}>
              <Text style={styles.text}>Net</Text>
              <Text style={styles.heading}>
                ${data?.stats?.totalIncome && data?.stats?.totalExpenses
                  ? data.stats.totalIncome - data.stats.totalExpenses
                  : 0}
              </Text>
            </div>
          </Section>

          <Text style={styles.text}>Thank you for using our service.</Text>
        </Container>
      </Body>
    </Html>
  );
};

const styles = {
  main: { backgroundColor: "#f5f5f5", padding: "20px" },
  container: { backgroundColor: "#ffffff", padding: "20px", borderRadius: "8px" },
  heading: { fontSize: "20px", fontWeight: "bold" },
  text: { fontSize: "16px", color: "#333" },
  statsContainer: { marginTop: "20px" },
  stat: { marginBottom: "10px" },
};

export default EmailTemplate;
