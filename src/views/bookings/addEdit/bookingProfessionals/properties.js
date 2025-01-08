import { FormItem, Input } from "components/ui";
import { Field } from "formik";
import React from "react";

const PropertyFields = ({ values, index }) => {
  const checkMealType = (status) => {
    switch (status) {
      case "ep":
        return "EP - (European Plan)";
      case "ap":
        return "AP - (American Plan)";
      case "cp":
        return "CP - (BreakFast)";
      case "map":
        return "MAP - (BreakFast & Dinner)";
      default:
        return null;
    }
  };
  const checkOccupancyType = (status) => {
    switch (status) {
      case "sgl":
        return "Single";
      case "dbl":
        return "Double";
      default:
        return null;
    }
  };
  return (
    <div>
      {values?.packages?.[index]?.properties?.map((property, propertyIndex) => {
        return (
          <>
            <h5 className="my-3 font-semibold">Property {propertyIndex + 1}</h5>
            <div className="grid md:grid-cols-2 gap-x-4">
              <FormItem label="Stay Name">
                <Field
                  component={Input}
                  value={property?.propertyId?.name}
                  disabled
                />
              </FormItem>
              <FormItem label="Room Name">
                <Field
                  component={Input}
                  value={property?.roomId?.name}
                  disabled
                />
              </FormItem>
              <FormItem label="Meal Type">
                <Field
                  component={Input}
                  value={checkMealType(property?.mealType)}
                  disabled
                />
              </FormItem>
              <FormItem label="Occupancy Type">
                <Field
                  component={Input}
                  value={checkOccupancyType(property?.occupancyType)}
                  disabled
                />
              </FormItem>
              <FormItem label={property?.nights > 1 ? "Nights" : "Night"}>
                <Field component={Input} value={property?.nights} disabled />
              </FormItem>
              <FormItem label="Room Price">
                <Field
                  component={Input}
                  value={
                    property?.roomPrice
                  }
                  disabled
                />
              </FormItem>
            </div>
          </>
        );
      })}
    </div>
  );
};

export default PropertyFields;
