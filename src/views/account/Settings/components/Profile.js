import React from "react";
import {
  Input,
  Avatar,
  Upload,
  FormContainer,
  Select,
  Button,
} from "components/ui";
import FormDesription from "./FormDesription";
import { Field, Form, Formik, ErrorMessage } from "formik";
import { HiOutlineUser } from "react-icons/hi";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import NumberFormat from "react-number-format";


const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  pinCode: Yup.string().required("Pin Code is required"),
  phone: Yup.string()
    .required("Phone is required")
    .matches(/^[0-9]+$/, "Only digits are allowed"),
  email: Yup.string().email("Invalid email").required("Email Required"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
});

const Profile = () => {
  const countryOptions = [
    { value: "India", label: "India" },
    { value: "United States", label: "United States" },
    { value: "Japan", label: "Japan" },
    { value: "France", label: "France" },
  ];

  const stateOptions = [
    { value: "Gujarat", label: "Gujarat" },
    { value: "Rajasthan", label: "Rajasthan" },
    { value: "Punjab", label: "Punjab" },
    { value: "Goa", label: "Goa" },
  ];

  const cityOptions = [
    { value: "Ahmedabad", label: "Ahmedabad" },
    { value: "Surat", label: "Surat" },
    { value: "Rajkot", label: "Rajkot" },
    { value: "vadodara", label: "vadodara" },
  ];

  const NumberFormatInput = ({ onValueChange, ...rest }) => {
    return (
      <NumberFormat
        customInput={Input}
        type='text'
        onValueChange={onValueChange}
        autoComplete='off'
        {...rest}
      />
    );
  };

  const data = useSelector((state) => state.auth.user);

  const onSetFormFile = (form, field, file) => {
    form.setFieldValue(field.name, URL.createObjectURL(file[0]));
  };

  const initialValues = {
    firstName: data?.data?.firstName,
    lastName: data?.data?.lastName,
    pinCode: data?.data?.pinCode,
    phone: data?.data?.phone,
    email: data?.data?.email,
    state: data?.data?.state,
    city: data?.data?.city,
  };
  //   const onFormSubmit = (values, setSubmitting) => {
  //     toast.push(<Notification title={"Profile updated"} type="success" />, {
  //       placement: "top-center",
  //     });
  //     setSubmitting(false);
  //   };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, validateForm }) => {
        validateForm().then((errors) => {
          if (Object.keys(errors).length === 0) {
            setSubmitting(true);
            setSubmitting(false);
          }
        });
      }}
    >
      {({ values, touched, errors, isSubmitting, resetForm }) => {
        return (
          <Form>
            <FormContainer>
              <FormDesription title='Profile' />
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                <div className='flex items-center gap-4'>
                  <label className='block text-gray-700 font-semibold mb-2'>
                    Avatar
                  </label>
                  <Field name='avatar'>
                    {({ field, form }) => {
                      const avatarProps = field.value
                        ? { src: field.value }
                        : {};
                      return (
                        <Upload
                          className='cursor-pointer'
                          onChange={(files) =>
                            onSetFormFile(form, field, files)
                          }
                          onFileRemove={(files) =>
                            onSetFormFile(form, field, files)
                          }
                          showList={false}
                          uploadLimit={1}
                        >
                          <Avatar
                            className='border-2 border-white dark:border-gray-800 shadow-lg'
                            size={60}
                            shape='circle'
                            icon={<HiOutlineUser />}
                            {...avatarProps}
                          />
                        </Upload>
                      );
                    }}
                  </Field>
                </div>
                <div className='flex items-center gap-4'>
                  <label className='block text-gray-700 font-semibold mb-2'>
                    Attach signature
                  </label>
                  <Field name='signature'>
                    {({ field, form }) => {
                      const avatarProps = field.value
                        ? { src: field.value }
                        : {};
                      return (
                        <Upload
                          className='cursor-pointer'
                          onChange={(files) =>
                            onSetFormFile(form, field, files)
                          }
                          onFileRemove={(files) =>
                            onSetFormFile(form, field, files)
                          }
                          showList={false}
                          uploadLimit={1}
                        >
                          <Avatar
                            className='border-2 border-white dark:border-gray-800 shadow-lg'
                            size={60}
                            shape='circle'
                            icon={<HiOutlineUser />}
                            {...avatarProps}
                          />
                        </Upload>
                      );
                    }}
                  </Field>
                </div>
                <div>
                  <label
                    className='block text-gray-700 font-semibold mb-2'
                    htmlFor='firstName'
                  >
                    First Name
                  </label>
                  <Field name='firstName' as={Input} className='input-class' />
                  <ErrorMessage
                    name='firstName'
                    component='div'
                    className='error-message text-red-500'
                  />
                </div>
                <div>
                  <label
                    className='block text-gray-700 font-semibold mb-2'
                    htmlFor='lastName'
                  >
                    Last Name
                  </label>
                  <Field name='lastName' as={Input} className='input-class' />
                  <ErrorMessage
                    name='lastName'
                    component='div'
                    className='error-message text-red-500'
                  />
                </div>

                <div>
                  <label
                    className='block text-gray-700 font-semibold mb-2'
                    htmlFor='country'
                  >
                    Country
                  </label>
                  <Select
                    isMulti={false}
                    defaultOptions
                    cacheOptions
                    placeholder='Select Country'
                    options={countryOptions}
                    // loadOptions={loadStays}
                    // componentAs={AsyncSelect}
                    className='font-semibold'
                    // onChange={(event) => setUser(event)}
                    getOptionLabel={(v) => `${v?.label}`}
                    getOptionValue={(v) => v?.value}
                    id='gstType'
                  />
                </div>
                <div>
                  <label
                    className='block text-gray-700 font-semibold mb-2'
                    htmlFor='state'
                  >
                    State <span className='text-red-500'>*</span>
                  </label>
                  <Field name='state'>
                    {({ field, form }) => (
                      <Select
                        isMulti={false}
                        defaultOptions
                        cacheOptions
                        placeholder='Select State'
                        options={stateOptions}
                        value={stateOptions.find(
                          (option) => option.value === field.value
                        )}
                        onChange={(option) =>
                          form.setFieldValue(field.name, option.value)
                        }
                        // loadOptions={loadStays}
                        // componentAs={AsyncSelect}
                        className='font-semibold'
                        // onChange={(event) => setUser(event)}
                        getOptionLabel={(v) => `${v?.label}`}
                        getOptionValue={(v) => v?.value}
                        id='gstType'
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name='state'
                    component='div'
                    className='error-message text-red-500'
                  />
                </div>
                <div>
                  <label
                    className='block text-gray-700 font-semibold mb-2'
                    htmlFor='city '
                  >
                    City <span className='text-red-500'>*</span>
                  </label>
                  <Field name='city'>
                    {({ field, form }) => (
                      <Select
                        isMulti={false}
                        defaultOptions
                        cacheOptions
                        placeholder='Select State'
                        options={cityOptions}
                        value={cityOptions.find(
                          (option) => option.value === field.value
                        )}
                        onChange={(option) =>
                          form.setFieldValue(field.name, option.value)
                        }
                        // loadOptions={loadStays}
                        // componentAs={AsyncSelect}
                        className='font-semibold'
                        // onChange={(event) => setUser(event)}
                        getOptionLabel={(v) => `${v?.label}`}
                        getOptionValue={(v) => v?.value}
                        id='gstType'
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name='city'
                    component='div'
                    className='error-message text-red-500'
                  />
                </div>
                <div>
                  <label
                    className='block text-gray-700 font-semibold mb-2'
                    htmlFor='pinCode'
                  >
                    Pin Code
                  </label>
                  <NumberFormatInput
                    // form={form}
                    // field={field}
                    // customInput={NumberInput}
                    placeholder='Pin Code'
                    // onValueChange={(e) => {
                    //   form.setFieldValue(field.name, e.value);
                    // }}
                  />
                </div>
                <div>
                  <label
                    className='block text-gray-700 font-semibold mb-2'
                    htmlFor='phone'
                  >
                    Phone
                  </label>
                  <Field
                    name='phone'
                    as={NumberFormatInput}
                    className='input-class'
                  />
                  <ErrorMessage
                    name='phone'
                    component='div'
                    className='error-message text-red-500'
                  />
                </div>
                <div>
                  <label
                    className='block text-gray-700 font-semibold mb-2'
                    htmlFor='email'
                  >
                    Email
                  </label>
                  <Field name='email' as={Input} className='input-class' />
                  <ErrorMessage
                    name='email'
                    component='div'
                    className='error-message text-red-500'
                  />
                </div>
                <div>
                  <label
                    className='block text-gray-700 font-semibold mb-2'
                    htmlFor='Longitude'
                  >
                    Longitude
                  </label>
                  <Input />
                </div>
                <div>
                  <label
                    className='block text-gray-700 font-semibold mb-2'
                    htmlFor='Latitude'
                  >
                    Latitude
                  </label>
                  <Input />
                </div>
                <div>
                  <label
                    className='block text-gray-700 font-semibold mb-2'
                    htmlFor='Address'
                  >
                    Address
                  </label>
                  <Input textArea />
                </div>
                <div className='flex justify-end items-end gap-4'>
                  <Button size='sm' variant='twoTone' type='button'>
                    Cancel
                  </Button>
                  <Button size='sm' variant='solid' type='submit'>
                    Upload Profile
                  </Button>
                </div>
              </div>
            </FormContainer>
          </Form>
        );
      }}
    </Formik>
  );
};

export default Profile;
