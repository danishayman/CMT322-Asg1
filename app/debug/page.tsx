

export default function debugPage(){
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    return(
        <div>
            <h1>Testing Debug</h1>
            <p>DB URL = ${url}</p>
            <p>DB ANON = ${anon}</p>
        </div>
    )
}