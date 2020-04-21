import fetch from 'node-fetch';
import * as template from '@reverbdotcom/url-template';
import { REPO_SLUG } from './github';
import { getInput } from './input';

const {
  CIToken,
  CIWorkflow,
} = getInput();

const ENCODED_SLASH_MATCHER = /%2F/g;
const PROJECT_SLUG = `github/${REPO_SLUG}`;
const SLASH = '/';

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
      'Circle-Token': CIToken,
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
    workflowName: CIWorkflow,
    projectSlug: PROJECT_SLUG,
  });
  return items.find(i => i.status === Status.success);
}

export async function fetchMostRecentGreenWorkflow(): Promise<Workflow | undefined> {
  const insightWorkflow = await fetchMostRecentGreenBuild();
  return insightWorkflow && requestWorkflow({
    id: insightWorkflow.id,
  });
}

export function generateLinkToGreenWorkflow(workflow: Workflow) {
  return WORKFLOW_LINK.expand({
    projectSlug: PROJECT_SLUG,
    pipelineNumber: workflow.pipeline_number,
    workflowID: workflow.id,
  }).replace(ENCODED_SLASH_MATCHER, SLASH);
}
