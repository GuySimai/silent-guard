
//------ShadcnUi Imports---------
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from "../ui/button";

//-----My Components Imports------
import BackButton from "@/components/auth/back-button";

//Defining the type of parameters we are accepting
type AuthCardProps = {
    children: React.ReactNode;
    cardTitle: string;
    backButtonHref: string;
    backButtonLabel: string;
}

export default function AuthCard({children,cardTitle,backButtonHref,backButtonLabel} : AuthCardProps){
    return (
        <Card className="flex justify-center h-[98vh]">
            <CardHeader className="w-full text-center">
                <CardTitle>{cardTitle}</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Here the component will be display */}
                <div className="mx-12"> 
                    {children}
                </div>
            </CardContent>
            <CardFooter>
                    {/* Maybe remove the first button will see */}
                <Button variant={"link"} asChild>
                        {/* Back button generic for different pages */}
                        <BackButton label={backButtonLabel} href={backButtonHref}/>
                </Button>
            </CardFooter>
    </Card>
    )
}
