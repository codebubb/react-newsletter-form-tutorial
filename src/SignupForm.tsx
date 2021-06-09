import React from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import Label from "./Label";
import axios from "axios";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
}

const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  lastName: Yup.string().min(2, "Too Short!").max(50, "Too Long!"),
  email: Yup.string().email("Invalid email").required("Required"),
});

const SignUpForm = () => {
  const submitForm = async (values: FormValues, formik: FormikHelpers<FormValues>) => {
    console.log(values);
    const { firstName, lastName, email } = values;
    try {
      const payload = {
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
        email_address: email,
      };

      await axios.post('/.netlify/functions/add-email-subscriber', payload);
      alert('Contact details added successfully.');
      formik.resetForm();
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <>
      <Formik
        initialValues={{ firstName: "", lastName: "", email: "" }}
        validationSchema={SignupSchema}
        onSubmit={submitForm}
      >
        {(formik) => (
          <Form className="w-64 bg-gray-50 p-4 flex flex-col shadow-sm">
            <h2 className="text-center text-2xl font-bold">
              Sign up for our newsletter!
            </h2>
            <div className="my-2 flex flex-col">
              <Label text="First Name" required={true} htmlFor="firstName" />
              <Field
                id="firstName"
                className="p-2 border-2 border-gray-400"
                name="firstName"
              ></Field>
              <ErrorMessage
                component="div"
                className="text-red-700"
                name="firstName"
              />
            </div>

            <div className="my-2 flex flex-col">
              <Label text="Last Name" htmlFor="lastName" />
              <Field
                id="lastName"
                className="p-2 border-2 border-gray-400"
                name="lastName"
              ></Field>
              <ErrorMessage
                component="div"
                className="text-red-700"
                name="lastName"
              />
            </div>

            <div className="my-2 flex flex-col">
              <Label text="Email" required={true} htmlFor="email" />
              <Field
                id="email"
                className="p-2 border-2 border-gray-400"
                name="email"
              ></Field>
              <ErrorMessage
                component="div"
                className="text-red-700"
                name="email"
              />
            </div>
            <button
              disabled={!formik.isValid || !formik.dirty}
              type="submit"
              className="disabled:opacity-50 my-2 px-4 py-2 bg-blue-700 text-white transition-all duration-300"
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default SignUpForm;
