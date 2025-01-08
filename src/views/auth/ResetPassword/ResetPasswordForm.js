import React, { useState } from "react";
import {
  Button,
  FormItem,
  FormContainer,
  Alert,
  toast,
  Notification,
} from "components/ui";
import { PasswordInput, ActionLink } from "components/shared";
import { apiResetPassword } from "services/AuthService";
import useTimeOutMessage from "utils/hooks/useTimeOutMessage";
import { useNavigate, useParams } from "react-router-dom";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { postApi } from "services/CommonService";
import { APIS } from "constants/api.constant";

const validationSchema = Yup.object().shape({
  password: Yup.string().required("Please enter your password"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Your passwords do not match"
  ),
});

const ResetPasswordForm = (props) => {
  const id = useParams();

  const { disableSubmit = false, className, signInUrl = "/sign-in" } = props;

  const [resetComplete, setResetComplete] = useState(false);

  const [message, setMessage] = useTimeOutMessage();

  const navigate = useNavigate();

  const onSubmit = async (values, setSubmitting) => {
    const { password } = values;
    setSubmitting(true);
    const payload = {
      id: id?.id,
      password: password,
    };
    postApi(APIS.UPDATE_PASSWORD, payload)
      .then(() => {
        setSubmitting(false);
        toast.push(
          <Notification type="success">Password Updated!</Notification>
        );
      })
      .finally(() => {
        navigate(`/sign-in`);
      });
  };

  const onContinue = () => {
    navigate("/sign-in");
  };

  return (
    <div className={className}>
      <div className="mb-6">
        {resetComplete ? (
          <>
            <h3 className="mb-1">Reset done</h3>
            <p>Your password has been successfully reset</p>
          </>
        ) : (
          <>
            <h3 className="mb-1">Set new password</h3>
            <p>Your new password must different to previos password</p>
          </>
        )}
      </div>
      {message && (
        <Alert className="mb-4" type="danger" showIcon>
          {message}
        </Alert>
      )}
      <Formik
        initialValues={{
          password: "",
          confirmPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          if (!disableSubmit) {
            onSubmit(values, setSubmitting);
          } else {
            setSubmitting(false);
          }
        }}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form>
            <FormContainer>
              {!resetComplete ? (
                <>
                  <FormItem
                    label="Password"
                    invalid={errors.password && touched.password}
                    errorMessage={errors.password}
                  >
                    <Field
                      autoComplete="off"
                      name="password"
                      placeholder="Password"
                      component={PasswordInput}
                    />
                  </FormItem>
                  <FormItem
                    label="Confirm Password"
                    invalid={errors.confirmPassword && touched.confirmPassword}
                    errorMessage={errors.confirmPassword}
                  >
                    <Field
                      autoComplete="off"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      component={PasswordInput}
                    />
                  </FormItem>
                  <Button
                    block
                    loading={isSubmitting}
                    variant="solid"
                    type="submit"
                  >
                    {isSubmitting ? "Submiting..." : "Submit"}
                  </Button>
                </>
              ) : (
                <Button
                  block
                  variant="solid"
                  type="button"
                  onClick={onContinue}
                >
                  Continue
                </Button>
              )}

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

export default ResetPasswordForm;
