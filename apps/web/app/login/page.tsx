"use client";

import login from "@/actions/login";
import { CheckFeature } from "@/components/check-feature";
import Company from "@/icons/company";
import GoogleIcon from "@/icons/google";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Separator } from "@workspace/ui/components/separator";
import { cn } from "@workspace/ui/lib/utils";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

const initialState = {
	type: "",
	message: "",
};

const Login = () => {
	const [state, formAction, pending] = useActionState(login, initialState);

	return (
		<div className="h-screen flex items-center justify-center">
			<div className="w-full h-full grid lg:grid-cols-2 p-4">
				<div className="bg-muted hidden lg:block rounded-lg">
					<div className="flex flex-col justify-center mt-32 px-8">
						<h2 className="pb-2 text-5xl font-semibold tracking-tight first:mt-0">
							Join millions worldwide who automate their work using Zapier.
						</h2>
						<div className="flex flex-col pt-10 space-y-6">
							<CheckFeature label="Easy setup, no coding required" />
							<CheckFeature label="Free forever for core features" />
							<CheckFeature label="14-day trial of premium features & apps" />
						</div>
					</div>
				</div>
				<div className="max-w-xs m-auto w-full flex flex-col items-center">
					<Company />
					<Button className="mt-8 w-full gap-3">
						<GoogleIcon />
						Continue with Google
					</Button>

					<div className="my-7 w-full flex items-center justify-center overflow-hidden">
						<Separator />
						<span className="text-sm px-2">OR</span>
						<Separator />
					</div>
					<form
						action={formAction}
						className={cn("w-full flex flex-col gap-6")}
					>
						<div className="grid gap-6">
							<div className="grid gap-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="m@example.com"
									defaultValue="mike_ross@email.com"
									required
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									name="password"
									type="password"
									required
									defaultValue="mike@091"
								/>
							</div>
							<p
								aria-live="polite"
								className={cn("text-sm", {
									"text-red-500": state?.type === "error",
									"text-green-500": state?.type === "success",
								})}
							>
								{state?.message}
							</p>
							<Button type="submit" className="w-full" disabled={pending}>
								{pending ? <Loader2 className="animate-spin" /> : "Login"}
							</Button>
						</div>
					</form>
					<div className="mt-5 space-y-5">
						<Link
							href="#"
							className="text-sm block underline text-muted-foreground text-center"
						>
							Forgot your password?
						</Link>
						<p className="text-sm text-center">
							Don&apos;t have an account?
							<Link href="#" className="ml-1 underline text-muted-foreground">
								Create account
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
