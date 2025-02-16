import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import IconButton from '@mui/material/IconButton';
import EditIcon from "@mui/icons-material/Edit";

const BillingForm = () => {
  const initialValues = {
    message: '',
    gstnum: '',
    phone: '',
    placesupply: '',
    invno:"",
  }; 


//   const onSubmit = (values) => {
//     console.log(values);
//   };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border border-gray-300 rounded-lg shadow-md">
      <Formik
        initialValues={initialValues}       
        // onSubmit={onSubmit}
      >
        {({ values, handleChange, handleBlur, }) => (
          <Form>
           
            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">            
              </label>
              <Field
              as="textarea"
                type="text"
                id="message"
                name="message"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.message}
              />
             
            </div>

          
            <div className="mb-4">
              <label htmlFor="gstnum" className="block text-sm font-medium text-gray-700">
              GST No
              </label>
              <Field
                type="text"
                id="gstNo"
                name="gstnum"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.gstnum}
              />
             
            </div>

            {/* Phone Input Field */}
            <div className="mb-4">
              <label htmlFor="phn" className="block text-sm font-medium text-gray-700">
              Contact Person
              </label>
              <Field
                type="text"
                id="phn"
                name="phone"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.phone}
              />
            
            </div>

            <div className="flex items-center gap-4">
                                        <div className="flex flex gap-5 flex-1">
                                            <label htmlFor="placesupply" className="mb-2 text-sm font-medium text-gray-700">Place of Supply</label>
                                            <div className="flex flex-col"><Field
                                                name="placesupply"
                                                placeholder="Select..."
                                                className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                            />                                              
                                              </div>

                                        </div>

                                        <IconButton
                                            aria-label="edit"
                                            sx={{
                                                backgroundColor: '#164e7f',
                                                color: '#FFFFFF',
                                                width: '40px', // Set width for square shape
                                                height: '40px', // Set height to match width
                                                borderRadius: '0', // Square corners
                                                '&:hover': {
                                                    backgroundColor: '#164e7f', // Darker shade for hover effect
                                                },
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </div>
                                    <div className="mb-4">
              <label htmlFor="phn" className="block text-sm font-medium text-gray-700">
              eCommerce Inv No
              </label>
              <Field
                type="text"
                id="invno"
                name="invno"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.invno}
              />
            
            </div>

          
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BillingForm;
