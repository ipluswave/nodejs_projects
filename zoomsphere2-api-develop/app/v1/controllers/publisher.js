'use strict';
var va = require(__dirname + '/../helpers/validator'),
  publisherModel = require(__dirname + '/../models/publisher'),
  SocialMediaFeedModel = require(__dirname + '/../models/socialMediaFeed'),
  modulesModel = require(__dirname + '/../models/modules');

class Publisher {

  static * listPosts(next) {
    var result = va.run(this, [va.PATH], {
      moduleId: va.number().required(),
      from: va.number().required(),
      to: va.number().required()
    });
    let module = yield modulesModel.getModule(this.state.authUser.id, result.moduleId);
    let posts = yield publisherModel.listPosts(module.id, result.from, result.to);
    this.body = {posts: posts};
    return yield next;
  }

  static * listStatuses(next) {
    var result = va.run(this, [va.PATH], {
      workspaceId: va.number().required()
    });

    let statuses = yield publisherModel.listWorkspaceStatuses(result.workspaceId, this.state.authUser.masterId);
    this.body = {statuses: statuses};
    return yield next;
  }

  static * listPublisherLabels(next) {
    var result = va.run(this, [va.PATH], {
      workspaceId: va.number().required()
    });

    let publisherLabels = yield publisherModel.listLabelsInWorkspace(this.state.authUser.masterId, result.workspaceId);
    this.body = {labels: publisherLabels};
    return yield next;
  }
  
  static * removeLabel(next) {
    var result = va.run(this, [va.PATH], {
      workspaceId: va.number().required(),
      labelId: va.number().required()      
    });

    yield publisherModel.deleteLabel(this.state.authUser.id, result.workspaceId === 0 ? null : result.workspaceId, result.labelId);
    this.body = {success: true};
    return yield next;
  }

  static * listUserLabels(next) {
    let userLabels = yield publisherModel.listUserLabelsWithoutId(this.state.authUser.masterId);
    this.body = {labels: userLabels};
    return yield next;
  }

  static * listAllLabels(next) {
    let customerCareLabels = yield SocialMediaFeedModel.listLabelsForUser(this.state.authUser.masterId);
    this.body = {labels: customerCareLabels};
    return yield next;
  }

  static * publisherStatuses(next) {
    let statuses = yield publisherModel.publisherStatuses(this.state.authUser.masterId);
    this.body = {statuses: statuses};
    return yield next;
  }
}
module.exports = Publisher;