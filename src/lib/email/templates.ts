type TemplateInput = {
  candidateName: string;
  jobTitle: string;
  companyName: string;
  reason?: string;
  missingSkills?: string[];
  improvementSuggestions?: string[];
};

function baseLayout(content: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { font-family: 'Manrope', Arial, sans-serif; background: #f5f7fb; margin: 0; padding: 0; }
    .container { max-width: 640px; margin: 30px auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; }
    .header { padding: 24px 32px; border-bottom: 1px solid #e2e8f0; }
    .content { padding: 24px 32px; color: #1f2937; }
    .footer { padding: 20px 32px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
    h1 { font-size: 20px; margin: 0 0 16px; }
    p { margin: 0 0 12px; line-height: 1.6; }
    ul { margin: 8px 0 16px 18px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <strong>${content ? "Helix HR" : "Helix HR"}</strong>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      This message was sent from Helix HR recruitment system.
    </div>
  </div>
</body>
</html>`;
}

export function applicationReceivedEmail(input: TemplateInput) {
  return baseLayout(`
    <h1>We’ve received your application</h1>
    <p>Hi ${input.candidateName},</p>
    <p>Thank you for applying for the ${input.jobTitle} role at ${input.companyName}. We’ve received your application and our team is reviewing it now.</p>
    <p>If your background aligns with the role, we’ll reach out with next steps.</p>
  `);
}

export function shortlistEmail(input: TemplateInput) {
  return baseLayout(`
    <h1>Your application has been accepted</h1>
    <p>Hi ${input.candidateName},</p>
    <p>Great news — your application for the ${input.jobTitle} role has been accepted. We’d like to move forward and will contact you shortly to coordinate next steps.</p>
    <p>Thank you for your time and interest in ${input.companyName}.</p>
  `);
}

export function rejectionEmail(input: TemplateInput) {
  const missingSkills = input.missingSkills?.length
    ? `<p>Areas where the role requires more depth:</p><ul>${input.missingSkills
        .map((skill) => `<li>${skill}</li>`)
        .join("")}</ul>`
    : "";
  const improvements = input.improvementSuggestions?.length
    ? `<p>Suggestions to strengthen your profile:</p><ul>${input.improvementSuggestions
        .map((tip) => `<li>${tip}</li>`)
        .join("")}</ul>`
    : "";

  return baseLayout(`
    <h1>Application update</h1>
    <p>Hi ${input.candidateName},</p>
    <p>Thank you for your interest in the ${input.jobTitle} role at ${input.companyName}. After careful review, we will not be moving forward at this time.</p>
    <p>${input.reason ?? "We had a strong applicant pool for this opening."}</p>
    ${missingSkills}
    ${improvements}
    <p>We appreciate your time and encourage you to apply for future opportunities.</p>
    <p>Please feel welcome to apply again later as new roles open.</p>
  `);
}
