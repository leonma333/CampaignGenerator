# CampaignGenerator

[![CampaignGenerator Build Status](https://travis-ci.org/Liang-Hsuan/CampaignGenerator.svg?branch=master)](https://travis-ci.org/Liang-Hsuan/CampaignGenerator)
[![CampaignGenerator Codecov](https://codecov.io/gh/Liang-Hsuan/CampaignGenerator/branch/master/graph/badge.svg)](https://codecov.io/gh/Liang-Hsuan/CampaignGenerator)
[![CampaignGenerator Docker Pulls](https://img.shields.io/docker/pulls/leonma333/campaign-generator)](https://hub.docker.com/r/leonma333/campaign-generator)

CampaignGenerator is an open-sourced web project that allows admin users to create marketing campaigns using WYSIWYG (What You See Is What You Get) editor. By using the rich text editor, admins can create nice-looking campaigns easily and quickly. Admins can also save the template and reuse it when creating a new campaign. For each campaign, the admin can apply the demographics that the campaign is targeting. In the end, there is a list of campaigns and templates for marketing.

CampaignGenerator does not send campaigns to users since its purpose is to generate campaign templates including metadata for downstream (see Figure 1). It is admins' responsibility to deliver the generated campaigns to the targeted demographics in whatever means. [Quill](https://quilljs.com/) is the underlying powerful WYSIWYG editor for the project. What the editor displayed is in HTML format, but when saving the campaign, it produces JSON data containing the metadata about the demographics, sending schedule, and the content itself. The content is in a generic format of [Delta](https://quilljs.com/docs/delta/) to adapt to different platforms. Of course, email is the main platform, so using Quill library can directly convert Delta to HTML. Not to mention native app can render HTML web view as well!

![CampaignGenerator Workflow](https://i.imgur.com/6fQONgO.jpg)

<sup>Figure 1: Simplified view of CampaignGenerator workflow</sup>

Quill already provides abundant tools for typical WYSIWYG editor, but admins can adding new functionalities themselves for their specific needs following the [guide](https://quilljs.com/guides/cloning-medium-with-parchment/) <sup>1</sup>. Again, all CampaignGenerator does is to set up all the necessary data, especially the content, for the backend workers to actually send the campaigns. The goal is to minimize the backend workers' workload, so ideally, the only work is to grab the template and send campaigns to email provider and/or notification service. Some times the campaign has a placeholder for dynamic content, then there involves some works before sending it to users. Figure 2 shows a typical worker's workflow.

![CampaignGenerator Worker](https://i.imgur.com/U1fOHeO.jpg)

<sup>Figure 2: Simplified backend worker workflow</sup>

---

<sup>1</sup> Now directing to Quill "adding new embed" guide, will change to CampaignGenerator-specific guide
