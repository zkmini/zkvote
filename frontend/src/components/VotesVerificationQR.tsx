import React from "react";
import { SelfQRcodeWrapper, SelfAppBuilder } from "@selfxyz/qrcode";

interface VotesVerificationQRProps {
  verificationConfig: any;
  onSuccess: () => void;
}

const VotesVerificationQR: React.FC<VotesVerificationQRProps> = ({ verificationConfig, onSuccess }) => {
  // Build the SelfApp instance using config from contract
  const selfApp = React.useMemo(() => {
    if (!verificationConfig) return null;
    return new SelfAppBuilder({
      appName: "ZK Vote Poll",
      scope: "zkvote-poll",
      endpoint: verificationConfig.pollAddress,
      endpointType: "staging_celo", // or your chain
      logoBase64: "", // Optionally add a logo
      userId: verificationConfig.userId || "",
      userIdType: "hex",
      disclosures: verificationConfig.disclosures || {},
      devMode: true,
    }).build();
  }, [verificationConfig]);

  if (!selfApp) return null;

  return (
    <div className="flex flex-col items-center">
      <SelfQRcodeWrapper
        selfApp={selfApp}
        type="websocket"
        onSuccess={onSuccess}
        onError={(error) => { console.error('SelfQRcode error:', error); }}
      />
      <p className="mt-2 text-gray-700">Scan with Self app to verify and vote.</p>
    </div>
  );
};

export default VotesVerificationQR;
