import React from "react";
import styled from "styled-components";
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { Snackbar } from "@mui/material";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
  align-items: center;
  @media (max-width: 960px) {
    padding: 0px;
  }
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 1350px;
  padding: 0px 0px 80px 0px;
  gap: 12px;
  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

const Title = styled.div`
  font-size: 42px;
  text-align: center;
  font-weight: 600;
  margin-top: 20px;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 32px;
  }
`;

const Desc = styled.div`
  font-size: 18px;
  text-align: center;
  max-width: 600px;
  color: ${({ theme }) => theme.text_secondary};
  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 16px;
  }
`;

const ContactForm = styled.form`
  width: 95%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.card};
  padding: 32px;
  border-radius: 16px;
  box-shadow: rgba(23, 92, 230, 0.15) 0px 4px 24px;
  margin-top: 28px;
  gap: 12px;
`;

const ContactTitle = styled.div`
  font-size: 24px;
  margin-bottom: 6px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const ContactInput = styled.input`
  flex: 1;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  outline: none;
  font-size: 18px;
  color: ${({ theme }) => theme.text_primary};
  border-radius: 12px;
  padding: 12px 16px;
  &:focus {
    border: 1px solid ${({ theme }) => theme.primary};
  }
`;

const ContactInputMessage = styled.textarea`
  flex: 1;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  outline: none;
  font-size: 18px;
  color: ${({ theme }) => theme.text_primary};
  border-radius: 12px;
  padding: 12px 16px;
  &:focus {
    border: 1px solid ${({ theme }) => theme.primary};
  }
`;

const ContactButton = styled.input`
  width: 100%;
  text-decoration: none;
  text-align: center;
  background: hsla(271, 100%, 50%, 1);
  background: linear-gradient(
    225deg,
    hsla(271, 100%, 50%, 1) 0%,
    hsla(294, 100%, 50%, 1) 100%
  );
  background: -moz-linear-gradient(
    225deg,
    hsla(271, 100%, 50%, 1) 0%,
    hsla(294, 100%, 50%, 1) 100%
  );
  background: -webkit-linear-gradient(
    225deg,
    hsla(271, 100%, 50%, 1) 0%,
    hsla(294, 100%, 50%, 1) 100%
  );
  padding: 13px 16px;
  margin-top: 2px;
  border-radius: 12px;
  border: none;
  color: ${({ theme }) => theme.text_primary};
  font-size: 18px;
  font-weight: 600;
`;

const Contact = () => {
  // --- No changes to hooks needed ---
  const [open, setOpen] = useState(false); // Changed to useState
  const form = useRef();
  const n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
  const n8nApiKey = import.meta.env.VITE_N8N_API_KEY;
  const sendToN8nWebhook = async (formData) => {
    // 2. We use the modern 'fetch' API to send the data.
    try {
      const response = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-N8N-API-KEY": n8nApiKey,
        },
        // We convert the form data object into a JSON string
        body: JSON.stringify(formData),
      });

      // 3. Check if n8n received the data successfully.
      if (response.ok) {
        // A successful response (e.g., status 200) means n8n got it.
        return { success: true };
      } else {
        // If n8n returns an error (e.g., 404, 500), we catch it here.
        const errorData = await response.json();
        console.error("Error from n8n:", errorData);
        return { success: false, error: "Server responded with an error." };
      }
    } catch (error) {
      // This catches network errors (e.g., user is offline).
      console.error("Network error sending data to n8n:", error);
      return { success: false, error: "A network error occurred." };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Get the form data into a simple object.
    const formData = new FormData(form.current);
    const formObject = {
      name: formData.get("from_name"),
      email: formData.get("from_email"),
      company: formData.get("Company"),
      message: formData.get("message"),
    };

    // 2. Call our new function to send the data.
    const result = await sendToN8nWebhook(formObject);

    // 3. Handle the result.
    if (result.success) {
      // If it was successful, show the success message and reset the form.
      setOpen(true);
      form.current.reset();
    } else {
      // If there was an error, you can show an error message.
      // For now, we'll just log it.
      // alert(`Submission failed: ${result.error || "Unknown error"}`);
      <Snackbar
        open={open}
        autoHideDuration={1000}
        onClose={() => setOpen(false)}
        style={{ zIndex: 9999, width: "40%" }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        message="Submission failed, try again"
        ContentProps={{
          style: {
            backgroundColor: "green",
            width: "100%",
            color: "white",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      />;
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>Contact</Title>
        <Desc>
          Feel free to reach out to me for any questions or opportunities!
        </Desc>
        <ContactForm ref={form} onSubmit={handleSubmit}>
          <ContactTitle>Email Me 🚀</ContactTitle>
          {/* Your input names must match what you use in formData.get() */}
          <ContactInput placeholder="Your Email" name="from_email" />
          <ContactInput placeholder="Your Name" name="from_name" />
          <ContactInput placeholder="Company" name="Company" />
          <ContactInputMessage placeholder="Message" rows="4" name="message" />
          <ContactButton type="submit" value="Send" />
          <Snackbar
            open={open}
            autoHideDuration={1000}
            onClose={() => setOpen(false)}
            style={{ zIndex: 9999, width: "40%" }}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            message="Message sent successfully!"
            ContentProps={{
              style: {
                backgroundColor: "green",
                width: "100%",
                color: "white",
                textAlign: "center",
                alignItems: "center",
                justifyContent: "center",
              },
            }}
          />
        </ContactForm>
      </Wrapper>
    </Container>
  );
};

export default Contact;
