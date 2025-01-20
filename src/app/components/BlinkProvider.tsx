import '@dialectlabs/blinks/index.css'
import { Blink, useAction } from "@dialectlabs/blinks";


export default function BlinkProvider() {
    const { action, isLoading } = useAction({
        url: 'http://localhost:3000/contract-address',
    });
    if (isLoading) {
        return <div>Loading...</div>; // Show a loading message
    }



    if (!action) {
        return <div>No action available. Please check the URL or API configuration.</div>;
    }

    return (
        <div className=' max-w-xl mx-auto  flex flex-col my-5 gap-4 justify-center'>
            <div className='flex items-center w-full justify-center text-3xl font-medium'>
                Get your meme coins within blinks
            </div>
            <div>

                <Blink stylePreset='x-dark' action={action} securityLevel="all" />
            </div>
        </div>
    )
}