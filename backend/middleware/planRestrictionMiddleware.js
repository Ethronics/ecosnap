const Company = require("../models/Company.js");

// Checks company plan limits for a given feature before proceeding
// Usage: planRestrictionMiddleware("employees") or planRestrictionMiddleware("domains")
module.exports = function planRestrictionMiddleware(featureKey) {
    return async function(req, res, next) {
        try {
            const companyId = req.params.companyId || req.params.id || req.body.companyId;
            if (!companyId) {
                return res.status(400).json({ message: "Company ID is required for plan restriction." });
            }

            const company = await Company.findById(companyId).populate(
                "plan",
                "name limits"
            );

            if (!company) {
                return res.status(404).json({ message: "Company not found" });
            }

            if (!company.plan) {
                return res.status(400).json({ message: "Company does not have an assigned plan" });
            }

            const limits = company.plan.limits || {};

            if (featureKey === "employees") {
                const currentEmployees = Array.isArray(company.employees) ? company.employees.length : 0;
                const maxEmployees = typeof limits.employees === "number" ? limits.employees : 0;
                if (currentEmployees >= maxEmployees) {
                    return res.status(403).json({
                        message: `Employee limit reached for ${company.plan.name} plan (${maxEmployees}). Upgrade required.`,
                    });
                }
            }

            if (featureKey === "domains") {
                const currentDomains = Array.isArray(company.domains) ? company.domains.length : 0;
                const maxDomains = typeof limits.domains === "number" ? limits.domains : 0;
                if (currentDomains >= maxDomains) {
                    return res.status(403).json({
                        message: `Domain limit reached for ${company.plan.name} plan (${maxDomains}). Upgrade required.`,
                    });
                }
            }

            return next();
        } catch (error) {
            return res.status(500).json({ message: "Failed to enforce plan restriction", error: error.message });
        }
    };
}