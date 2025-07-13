import { useSelector } from 'react-redux';
import { generateWalletId } from '../services/walletService'
import { useNavigate } from 'react-router-dom';

const GenerateWalletId = () => {

    const navigate = useNavigate();
    const user = useSelector(store => store?.auth.user);

    const handleGenerateWalletId = async (e) => {
        try {
            const res = await generateWalletId();
            if (res.data) {
                // use store to store walletId in user
                
                navigate("dashboard")
            }
        } catch (error) {
            console.log("Generate walletid-", error);
        }
    }

    return (
        <div className='bg-white w-full md:w-96 py-8 md:px-8 px-6 shadow rounded-lg'>
            <div className='flex justify-center items-center flex-col'>
                <h2>Generate Wallet Id</h2>
                <button onClick={handleGenerateWalletId} className='w-auto mt-5 flex justify-center items-center cursor-pointer outline-none py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700'>Generate</button>
            </div>
        </div>
    )
}

export default GenerateWalletId