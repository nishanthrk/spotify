import { getProviders, signIn } from "next-auth/react"


function Login({ providers }) {
    return (
        <div className="flex items-center min-h-screen w-full justify-center space-x-6 bg-black">
            <img className="w-52 mb-5" src="https://links.papareact.com/9xl" alt="Spotify" />
            {Object.values(providers).map((provider) => (
                <div key={provider.name}>
                    <button className="bg-[#18D860] text-black p-4 rounded-full" onClick={() => signIn(provider.id, {callbackUrl: "/"})}> Login with {provider.name }</button>
                </div>
            ))}
        </div>
    );
}

export default Login;

export async function getServerSideProps() {
    console.log("IM INSIDE GET SERVER SIDE PROPS");
    const providers = await getProviders();
    console.log(providers);
    return {
        props: {
            providers
        }
    }
}
