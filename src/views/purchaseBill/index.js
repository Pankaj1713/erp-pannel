
import React from "react";

import HeaderPurchase from "./purchasebill header/purchasebill header comonents/HeaderPurchase";
import PurchasebillFormOne from "./PuchasebillForms/PurchasebillFormOne";
import BillingForm from "./PuchasebillForms/BillingForm";
import ShippingForm from "./PuchasebillForms/ShippingForm";

const PurchaseBill = () => {

  

    return (
        <div className="fllex flex-col">
          <HeaderPurchase/>
           <PurchasebillFormOne/>
          
            </div>
          
       
    );
};

export default PurchaseBill;