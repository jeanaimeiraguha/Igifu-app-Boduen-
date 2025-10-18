<!--
  ==========================================================
  ----------------------------------------------------------
  Created by: Iraguha Jean Aime & Niyonkuru Boduen
  Description: Markdown-based email templates for app use.
  Date: 2025
  ==========================================================
-->

# 📧 Mailing Templates

This document contains reusable **Markdown email templates** you can integrate in your app.  
Replace the placeholders (`{{placeholder}}`) with real data dynamically.

---

## 📨 1. Welcome Email

```markdown
# Welcome to {{app_name}}, {{name}}! 🎉

Hi {{name}},

Thanks for joining **{{app_name}}** — we’re excited to have you!

**Quick start**
- Visit your dashboard: [Open dashboard]({{dashboard_url}})
- Learn how it works: [Getting started guide]({{getting_started_url}})

If you need help, reply to this email or visit our Help Center: {{help_url}}.

Welcome aboard,  
The {{app_name}} Team
```

---

## ✅ 2. Email Verification

```markdown
# Verify your email for **{{app_name}}**

Hi {{name}},

Thanks for signing up. Please confirm your email address by clicking the link below:

[Verify my email]({{verification_link}})

If that button doesn't work, copy and paste the link into your browser:
{{verification_link}}

If you didn't sign up for {{app_name}}, you can ignore this email.

Thanks,  
{{app_name}} Support
```

---

## 🔑 3. Password Reset

```markdown
# Reset your password

Hi {{name}},

We received a request to reset your password for **{{app_name}}**. Click the link below to set a new password:

[Reset my password]({{reset_link}})

This link will expire in **{{expiry_minutes}} minutes**.  
If you didn't request a password reset, ignore this message or contact support.

Stay safe,  
The {{app_name}} Team
```

---

## 🛒 4. Order / Transaction Confirmation

```markdown
# Your order is confirmed — Order #{{order_number}}

Hi {{name}},

Thanks for your purchase! Below are the details:

**Order:** #{{order_number}}  
**Date:** {{order_date}}  
**Total:** {{order_total}}

**Items**
{{#items}}
- {{quantity}} × **{{title}}** — {{price}}
{{/items}}

Track your order: [Track shipment]({{tracking_url}})

If you have questions, reply to this email or contact support at {{support_email}}.

Thanks for shopping with **{{app_name}}**!  
— {{app_name}} Team
```

---

## 📰 5. Weekly Newsletter

```markdown
# {{newsletter_title}} — Week of {{week_start_date}}

Hi {{name}},

Here’s what’s new in **{{app_name}}** this week:

**Highlights**
- {{highlight_1}}
- {{highlight_2}}
- {{highlight_3}}

**Featured article**  
[{{feature_title}}]({{feature_url}})  
{{feature_excerpt}}

Want more? Visit our blog: [{{blog_url}}]({{blog_url}})

Cheers,  
{{app_name}} Editorial Team
```

---

## 😔 6. Account Cancellation / Goodbye

```markdown
# We're sorry to see you go, {{name}}

Hi {{name}},

Your account has been scheduled for deletion on **{{deletion_date}}**.  
If this was a mistake, you can restore your account before that date by visiting:

[Restore my account]({{restore_url}})

If you have a moment, please tell us why you're leaving: {{feedback_url}}

Wishing you all the best,  
The {{app_name}} Team
```

---

## 🧠 7. Example of Dynamic Replacement (JavaScript)

```javascript
function renderTemplate(template, data) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return key in data ? data[key] : '';
  });
}

// Example usage
const md = `# Welcome {{name}} to {{app_name}}`;
const filled = renderTemplate(md, { name: 'Jean', app_name: 'IraguhaApp' });
// Convert Markdown -> HTML before sending email
```

---

### ⚙️ Notes
- Use a Markdown-to-HTML converter (e.g., **marked**, **markdown-it**) before sending.  
- Sanitize any user data to prevent HTML injection.  
- For loops like `{{#items}}`, use a templating engine such as **Handlebars** or **Mustache**.  
- Keep your subject lines short and relevant.  
- Always include support or unsubscribe links in transactional and marketing emails.

---

**© 2025 | Created by Iraguha Jean Aime & Niyonkuru Boduen**
