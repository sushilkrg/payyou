import { generateWalletId } from '../services/walletService'

const GenerateWalletId = () => {

    const handleGenerateWalletId = async (e) => {
        try {
            console.log("generate button clicked");

            // const res = await generateWalletId();
            // if (res.data) {
            //     console.log(res.data.message);

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