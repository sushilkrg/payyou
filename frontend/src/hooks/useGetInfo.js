import { useDispatch } from "react-redux";
import { getMyWalletInfo } from "../services/walletService";
import { useEffect } from "react";
import { setUser } from "../features/auth/authSlice";

const useGetInfo = () => {
  const dispatch = useDispatch();

  const walletAndUserInfo = async () => {
    try {
      const res = await getMyWalletInfo();
      //   console.log(res.data);
      dispatch(setUser(res.data));
    } catch (error) {
      console.log("error in useGetInfo ", error);
    }
  };

  useEffect(() => {
    walletAndUserInfo();
  }, []);
};

export default useGetInfo;
