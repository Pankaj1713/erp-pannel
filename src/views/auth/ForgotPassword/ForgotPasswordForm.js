import React, { useState } from "react";
import { Input, Button, FormItem, FormContainer } from "components/ui";
import { ActionLink } from "components/shared";
import { apiForgotPassword } from "services/AuthService";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  email: Yup.string().required("Please enter your email"),
});

const ForgotPasswordForm = (props) => {
  const { disableSubmit = false, className, signInUrl = "/sign-in" } = props;
  const [emailSent, setEmailSent] = useState(false);

  const onSendMail = async (values, setSubmitting) => {
    setSubmitting(true);
    try {
      const resp = await apiForgotPassword(values);
      if (resp.data) {
        setSubmitting(false);
        setEmailSent(true);
      }
    } catch (errors) {
      setSubmitting(false);
    }
  };

  return (
    <div className={className}>
      <div className="mb-6">
        {emailSent ? (
          <>
            <h3 className="mb-1">Check your email</h3>
            <p>We have sent a password recovery instruction to your email</p>
          </>
        ) : (
          <>
            <h3 className="mb-1">Forgot Password</h3>
            <p>
              Please enter your email address to receive a verification link
            </p>
          </>
        )}
      </div>

      <Formik
        initialValues={{
          email: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          if (!disableSubmit) {
            onSendMail(values, setSubmitting);
          } else {
            setSubmitting(false);
          }
        }}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form>
            <FormContainer>
              <div className={emailSent ? "hidden" : ""}>
                <FormItem
                  invalid={errors.email && touched.email}
                  errorMessage={errors.email}
                >
                  <Field
                    type="email"
                    autoComplete="off"
                    name="email"
                    placeholder="Email"
                    component={Input}
                  />
                </FormItem>
              </div>
              <div className={emailSent ? "hidden" : ""}>
                <Button
                  block
                  loading={isSubmitting}
                  variant="solid"
                  type="submit"
                >
                  Send Email
                </Button>
              </div>
              <div className="mt-4 text-center">
                <span>Back to </span>
                <ActionLink to={signInUrl}>Sign in</ActionLink>
              </div>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ForgotPasswordForm;
