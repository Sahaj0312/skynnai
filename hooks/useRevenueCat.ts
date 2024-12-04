import Purchases, {
  CustomerInfo,
  PurchasesOffering,
} from "react-native-purchases";
import { useState, useEffect } from "react";

const typesOfSubscriptions = {
  weekly: "skynnaiProWeekly",
  monthly: "skynnaiProMonthly",
} as const;

function useRevenueCat() {
  const [currentOffering, setCurrentOffering] =
    useState<PurchasesOffering | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  const isProMember = customerInfo?.entitlements.active.pro != null;

  useEffect(() => {
    const loadData = async () => {
      try {
        const customerInfo = await Purchases.getCustomerInfo();
        const offerings = await Purchases.getOfferings();

        setCustomerInfo(customerInfo);
        setCurrentOffering(offerings.current);
      } catch (error) {
        console.error("Error loading RevenueCat data:", error);
      }
    };

    loadData();

    const customerInfoUpdateListener = Purchases.addCustomerInfoUpdateListener(
      (info) => {
        setCustomerInfo(info);
      }
    );

    // return () => {
    //   customerInfoUpdateListener.remove();
    // };
  }, []);

  return { currentOffering, customerInfo, isProMember };
}
export default useRevenueCat;
