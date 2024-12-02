import Purchases, {
  CustomerInfo,
  PurchasesOffering,
} from "react-native-purchases";
import { useState, useEffect } from "react";

const typesOfSubscriptions = {
  weekly: "skynnaiProWeekly",
  monthly: "skynnaiProMonthly",
};

function useRevenueCat() {
  const [currentOffering, setCurrentOffering] =
    useState<PurchasesOffering | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  const isProMember = customerInfo?.activeSubscriptions.includes(
    typesOfSubscriptions.weekly || typesOfSubscriptions.monthly
  );

  useEffect(() => {
    const loadData = async () => {
      const customerInfo = await Purchases.getCustomerInfo();
      const offerings = await Purchases.getOfferings();
      setCustomerInfo(customerInfo);
      setCurrentOffering(offerings.current);
    };
    loadData().catch(console.error);
  }, []);

  useEffect(() => {
    const customerInfoUpdated = async (purchaserInfo: CustomerInfo) => {
      setCustomerInfo(purchaserInfo);
    };
    Purchases.addCustomerInfoUpdateListener(customerInfoUpdated);
  }, []);

  return { currentOffering, customerInfo, isProMember };
}
export default useRevenueCat;
