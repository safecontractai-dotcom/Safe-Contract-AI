import re

def detect_risks(text):
    """
    Rule-based risk detection engine.
    Returns a list of structured risk objects.
    """

    risks = []

    RULES = [
        {
            "pattern": r"(no liability|not liable|without liability|limited liability)",
            "category": "Liability",
            "severity": "high",
            "message": "Contract contains liability limitation terms."
        },
        {
            "pattern": r"(no refund|non-refundable|refunds will not be provided)",
            "category": "Payment Terms",
            "severity": "medium",
            "message": "Refund restrictions detected."
        },
        {
            "pattern": r"(indemnif(y|ication)|hold harmless|defend against claims)",
            "category": "Indemnity",
            "severity": "high",
            "message": "Indemnity clause identified—this may shift legal liability."
        },
        {
            "pattern": r"(confidentiality|non-disclosure|nda)",
            "category": "Confidentiality",
            "severity": "low",
            "message": "Confidentiality clause detected."
        },
        {
            "pattern": r"(terminate at any time|may terminate without notice)",
            "category": "Termination",
            "severity": "medium",
            "message": "Unilateral termination rights found."
        },
        {
            "pattern": r"(governing law|jurisdiction|venue)",
            "category": "Governing Law",
            "severity": "low",
            "message": "Governing law clause detected."
        },
        {
            "pattern": r"(intellectual property|all rights reserved|ownership of work)",
            "category": "Intellectual Property",
            "severity": "medium",
            "message": "Intellectual property ownership terms detected."
        },
        {
            "pattern": r"(arbitration|dispute resolution|mediation)",
            "category": "Dispute Resolution",
            "severity": "low",
            "message": "Arbitration or dispute resolution clause detected."
        },
        {
            "pattern": r"(automatic renewal|auto-renewal|renewed automatically)",
            "category": "Renewal Terms",
            "severity": "medium",
            "message": "Auto-renewal terms detected."
        },
    ]

    for rule in RULES:
        matches = re.findall(rule["pattern"], text, flags=re.IGNORECASE)
        if matches:
            risks.append({
                "category": rule["category"],
                "severity": rule["severity"],
                "message": rule["message"],
                "occurrences": len(matches),
            })

    return risks
