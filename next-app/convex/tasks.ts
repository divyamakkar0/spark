import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { action } from "./_generated/server";

import Groq from "groq-sdk";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("companies").collect();
  },
});




export const getCompaniesById = query({
  args: { taskId: v.id("companies") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    return task;
  },
});


export const goodCategories = query({
  args: {},
  handler: async (ctx) => {
    const groq = new Groq({apiKey: "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"});
    const categories = await ctx.db.query("categories").collect();


  },
});

export const fixWords = action({
  args: {
    words: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const groq = new Groq({apiKey: "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"});
    const fixedWords = await Promise.all(args.words.map(async (word) => {
      const prompt = `Fix the following word: "${word}"`;
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "mixtral-8x7b-32768",
      });

      const fixedWord = completion.choices[0]?.message?.content?.trim() || word;
      return fixedWord;
    }));

    return fixedWords;
  },
});



export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

export const resetCategories = mutation({
  handler: async (ctx) => {
    const allCategories = await ctx.db.query("categories").collect();
    for (const category of allCategories) {
      await ctx.db.delete(category._id);
    }
  },
});

export const addCategories = mutation({
  args: {
      categories: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("categories", {category: args.categories});
  },
});


export const setupCategories = mutation({
  handler: async (ctx, args) => {

    const data = [
      {category: 'name'},
      {category: 'description'},
      {category: 'location_identifiers'},
      {category: 'website'},
      {category: 'num_employees_enum'},
      {category: 'last_funding_total'},
      {category: 'last_funding_type'},

    ]

    for (const category of data) {
      await ctx.db.insert("categories", category);
    }

  },
});




export const createNewCompanySearch = mutation({


  args: {
    data: v.optional(v.array(v.object({
      name: v.optional(v.string()),
      imageUrl: v.optional(v.string()),
      short_description: v.optional(v.string()),
      description: v.optional(v.string()),
      last_funding_at: v.optional(v.string()),
      last_funding_type: v.optional(v.string()),
      link: v.optional(v.string()),
      last_funding_total: v.optional(v.object({
        currency: v.optional(v.string()),
        value: v.optional(v.number()),
        value_usd: v.optional(v.number())
      })),
      category_groups: v.optional(v.array(v.object({
        entity_def_id: v.optional(v.string()),
        permalink: v.optional(v.string()),
        uuid: v.optional(v.string()),
        value: v.optional(v.string())
      }))),
      num_employees_enum: v.optional(v.string()),
      type: v.optional(v.string()),
      uuid: v.optional(v.string()),
      website: v.optional(v.object({ value: v.string() })),
      linkedin: v.optional(v.object({ value: v.string() })),
      twitter: v.optional(v.object({ value: v.string() })),
      facebook: v.optional(v.object({ value: v.string() })),
      contact_email: v.optional(v.string()),
      categories: v.optional(v.array(v.object({
        entity_def_id: v.optional(v.string()),
        permalink: v.optional(v.string()),
        uuid: v.optional(v.string()),
        value: v.optional(v.string())
      }))),
      founder_identifiers: v.optional(v.array(v.object({
        entity_def_id: v.optional(v.string()),
        image_id: v.optional(v.string()),
        uuid: v.optional(v.string()),
        permalink: v.optional(v.string()),
        value: v.optional(v.string())
      }))),
      identifier: v.optional(v.object({
        entity_def_id: v.optional(v.string()),
        image_id: v.optional(v.string()),
        permalink: v.optional(v.string()),
        uuid: v.optional(v.string()),
        value: v.optional(v.string())
      })),
      location_identifiers: v.optional(v.array(v.object({
        entity_def_id: v.optional(v.string()),
        location_type: v.optional(v.string()),
        permalink: v.optional(v.string()),
        uuid: v.optional(v.string()),
        value: v.optional(v.string())
      })))
  }))),

  },
  handler: async (ctx, args) => {
    console.log(args);

    // reset the companies table
    const allCompanies = await ctx.db.query("companies").collect();
    for (const company of allCompanies) {
      await ctx.db.delete(company._id);
    }

    // insert the new companies
    for (const company of args.data || []) {
      const companyData: any = {};

      if (company.name) companyData.name = company.name;
      if (company.imageUrl) companyData.image_url = company.imageUrl;
      if (company.short_description) {companyData.short_description = company.short_description;}
      else {companyData.short_description = "null";}
      if (company.description) {companyData.description = company.description;}
      else {companyData.description = "null";}
      if (company.last_funding_at) companyData.last_funding_at = company.last_funding_at;
      if (company.last_funding_type) companyData.last_funding_type = company.last_funding_type;
      if (company.link) companyData.link = company.link;
      if (company.last_funding_total) companyData.last_funding_total = company.last_funding_total;
      if (company.category_groups) companyData.category_groups = company.category_groups;
      if (company.num_employees_enum) companyData.num_employees_enum = company.num_employees_enum;
      if (company.type) companyData.type = company.type;
      if (company.uuid) companyData.uuid = company.uuid;
      if (company.website?.value) companyData.website_url = company.website.value;
      if (company.linkedin?.value) {companyData.linkedin_url = company.linkedin.value;}
      else {companyData.linkedin_url = "null";}
      if (company.twitter?.value) companyData.twitter_url = company.twitter.value;
      if (company.facebook?.value) companyData.facebook_url = company.facebook.value;
      if (company.categories) companyData.categories = company.categories;
      if (company.founder_identifiers) companyData.founder_identifiers = company.founder_identifiers;
      if (company.identifier) companyData.identifier = company.identifier;
      if (company.location_identifiers) companyData.location_identifiers = company.location_identifiers;
      if (company.contact_email) companyData.contact_email = company.contact_email;
      companyData.bool_val = false;

      if (Object.keys(companyData).length > 0) {
        await ctx.db.insert("companies", companyData);
      }
    }
  },
});

export const deleteAllTasks = mutation({
  handler: async (ctx) => {
    const allTasks = await ctx.db.query("tasks").collect();
    for (const task of allTasks) {
      await ctx.db.delete(task._id);
    }
  },
});



export const updateCompany = mutation({
  args: {
    companyId: v.id("companies"),
    boolVal: v.optional(v.boolean()),
    contact:v.optional(v.string()),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.companyId, { bool_val: true, contact: args.contact, message: args.message});
  },
});
