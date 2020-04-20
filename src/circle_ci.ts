import fetch from 'node-fetch';
import * as core from '@actions/core';
import * as template from '@reverbdotcom/url-template';

const ENCODED_SLASH_MATCHER = /%2F/g;
const SLASH = '/';

const CIRCLE_TOKEN = core.getInput('circle_ci_token', {
  required: true,
});

const PROJECT_SLUG = core.getInput('circle_ci_project_slug', {
  required: true,
});

const WORKFLOW_NAME = core.getInput('circle_ci_workflow_name: ', {
  required: true,
});

const WORKFLOW_LINK = template.parse(
  'https://app.circleci.com/pipelines/{projectSlug}/{pipelineNumber}/workflows/{workflowID}'
);

const ENDPOINTS = {
  insights: template.parse(
    'https://circleci.com/api/v2/insights/{projectSlug}/workflows/{workflowName}?branch=master'
  ),
  workflow: template.parse(
    'https://circleci.com/api/v2/workflow/{id}'
  ),
};

type UUID = string;

enum Status {
  success = 'success',
  failed = 'failed',
}

interface InsightWorkflow {
  created_at: string;
  credits_used: number;
  duration: number;
  id: UUID;
  status: Status;
  stopped_at: string;
}

interface InsightResponse {
  next_page_token: string;
  items: InsightWorkflow[];
}

interface Workflow {
  created_at: string;
  id: string;
  name: string;
  pipeline_id: UUID;
  pipeline_number: number;
  project_slug: string;
  status: Status;
  stopped_at: string;
}

async function request<R>(
  endpoint: template.ParsedTemplate<template.BaseContext>,
  params = {} as any,
): Promise<R> {
  const url = endpoint.expand(params);
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Circle-Token': CIRCLE_TOKEN,
    },
  });
  return response.json();
}

async function requestInsights(
  params: {
    projectSlug: string;
    workflowName: string;
  },
) {
  return request<InsightResponse>(ENDPOINTS.insights, params);
}

async function requestWorkflow(
  params: {
    id: UUID;
  },
) {
  return request<Workflow>(ENDPOINTS.workflow, params);
}

async function fetchMostRecentGreenBuild(): Promise<InsightWorkflow> {
  const { items } = await requestInsights({
    workflowName: WORKFLOW_NAME,
    projectSlug: PROJECT_SLUG,
  });
  return items.find(i => i.status === Status.success);
}

export async function generateURLToPassedWorkflow(): Promise<string> {
  const insightWorkflow = await fetchMostRecentGreenBuild();
  if (!insightWorkflow) return '';

  const workflow = await requestWorkflow({
    id: insightWorkflow.id,
  });

  return WORKFLOW_LINK.expand({
    projectSlug: PROJECT_SLUG,
    pipelineNumber: workflow.pipeline_number,
    workflowID: workflow.id,
  }).replace(ENCODED_SLASH_MATCHER, SLASH);
}
