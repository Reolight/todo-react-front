export default class Backend {
    private uri : string
    private static instance : Backend | null = null

    private constructor(Uri: string){
        this.uri = Uri;
    }

    public static getInstance(baseUri?: string): Backend {
        if (Backend.instance === null)
            Backend.instance = new Backend(baseUri as string)
        return Backend.instance as Backend
    }

    async post<T>(relativeUri: string, posted: T): Promise<boolean> {
        console.log(`posting uri: ${this.uri}/${relativeUri}`)
        const response = await fetch(`${this.uri}/${relativeUri}`, 
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(posted)
            })
        return response.ok
    }

    async getBy<T>(relativeUri: string, byWhat: string): Promise<T[]> {
        console.log(`getting from uri: ${this.uri}/${relativeUri}/${byWhat}`)
        const response = await fetch(`${this.uri}/${relativeUri}/${byWhat}`)
        const data = await response.json()
        return data as T[];
    }

    async update(relativeUri: string, id: string, entity: any): Promise<boolean> {
        console.log(`updating on uri: ${this.uri}/${relativeUri}/${id}`)
        console.log(`entity: ${JSON.stringify(entity)}`)
        const response = await fetch(`${this.uri}/${relativeUri}/${id}`,
        {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entity)
        })

        return response.ok
    }

    async delete(relativeUri: string, id: string): Promise<boolean> {
        const response = await fetch(`${this.uri}/${relativeUri}/${id}`,
        {
            method: "DELETE"
        })

        return response.ok
    }
}