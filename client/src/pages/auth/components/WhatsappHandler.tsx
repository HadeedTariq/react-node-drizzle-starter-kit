import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/axios";
import { toast } from "@/hooks/use-toast";

const WhatsappHandler = ({
  setShowOtp,
}: {
  setShowOtp: any;
  signup: boolean;
}) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const { mutate, isPending: isWhatsappAuthLoading } = useMutation({
    mutationKey: ["authenticate-whatsapp"],
    mutationFn: async (actualPhoneNumber: string) => {
      const { data } = await authApi.post("/whatsapp-otp-handler", {
        phoneNumber: actualPhoneNumber,
      });
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: data.message || "Otp send successfully",
      });
      setShowOtp(true);
      const now = new Date();
      localStorage.setItem(
        "current-phone-number",
        JSON.stringify({
          phoneNumber: phoneNumber,
          expiry: now.getTime() + 5 * 60 * 1000,
        })
      );
    },
    onError: (error: ErrResponse) => {
      toast({
        title: error.response?.data.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });
  const handlePhoneLogin = () => {
    const actualPhoneNumber = phoneNumber;

    if (phoneNumber.startsWith("+92")) {
      const actualPhoneNumber = phoneNumber
        .replace("+92", "0")
        .split(" ")
        .join("");

      if (actualPhoneNumber.length !== 11) {
        toast({
          title: "Phone number must be 11 digits",
          variant: "destructive",
        });
        return;
      }
    }
    mutate(actualPhoneNumber);
  };
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="flex items-center gap-2  rounded-md ">
          <div className="flex items-center px-6 border-2 py-2 rounded-md w-fit">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/3/32/Flag_of_Pakistan.svg"
              alt="Pakistan Flag"
              className="w-5 h-5 mr-2"
            />
            <span className="text-sm">+92</span>
          </div>

          <Input
            id="phone"
            type="tel"
            placeholder="+92 300 1234567"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <Button
          type="button"
          className="w-full bg-[#50CD5D] hover:bg-[#5bd66b] focus:ring-2 focus:ring-[#5bd66b] focus:ring-offset-2 focus:ring-offset-background"
          onClick={() => handlePhoneLogin()}
          disabled={isWhatsappAuthLoading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
          >
            <path
              fill="#25D366"
              d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
            />
          </svg>
          <span className="my-6">Send code via WhatsApp</span>
        </Button>
      </div>
    </>
  );
};

export default WhatsappHandler;
