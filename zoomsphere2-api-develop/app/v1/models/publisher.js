'use strict';
var sequelize = require('sequelize'),
  db = require(__dirname + '/../../../services').db,
  Utils = require(__dirname + '/../helpers/utils'),
  Replace = require(__dirname + '/../helpers/replace'),
  ZSError = require('zs-error'),
  Workspaces = require('./workspaces'),
  UserLabelSchema = db.import(__dirname + '/../schemas/user_label_outgoing'),
  ModulesSchema = db.import(__dirname + '/../schemas/ec_module'),
  StatusSchema = db.import(__dirname + '/../schemas/postbox_status');

var defaultLabels = [
  {name: 'Webinar', color: '#9065cb'},
  {name: 'Just for fun', color: '#79c7d5'},
  {name: 'Contest', color: '#62af5e'},
  {name: 'Product Information', color: '#ec9f51'},
  {name: 'Infographic', color: '#9a9ea7'},
  {name: 'Hard Sell', color: '#fc8366'},
  {name: 'Case study', color: '#5290d9'}
];

var defaultStatuses = [{
  'name': 'Private draft',
  'access_read': 'owner',
  'access_write': 'owner',
  'publish': false,
  'color': '#FFFFFF',
  'bgcolor': '#00CCFF'
}, {
  'name': 'Waiting for Documents',
  'access_read': 'admin,owner',
  'access_write': 'admin,owner',
  'publish': false,
  'color': '#FFFFFF',
  'bgcolor': '#996600'
}, {
  'name': 'To Approve',
  'access_read': 'admin,client,owner',
  'access_write': 'admin,client,owner',
  'publish': false,
  'color': '#FFFFFF',
  'bgcolor': '#FF9900'
}, {
  'name': 'Approved',
  'access_read': 'admin,client,editor',
  'access_write': 'admin,client',
  'publish': true,
  'color': '#FFFFFF',
  'bgcolor': '#00FF00'
}, {
  'name': 'Approved, not to publish',
  'access_read': 'admin,client,editor',
  'access_write': 'admin,client',
  'publish': false,
  'color': '#FFFFFF',
  'bgcolor': '#009900'
}, {
  'name': 'Sent',
  'access_read': 'admin,client,owner,editor',
  'publish': false,
  'color': '#000000',
  'bgcolor': '#b5b5b5',
  'sent': true
}];

class Publisher {

  static * listLabels(userId) {
    let where = {user_id: userId};
    let rows = yield UserLabelSchema.findAll({attributes: ['id', 'name', 'color', 'workspace_id'], where: where});
    if (!rows[0]) {
      yield Publisher.createLabels(userId, null);
      rows = yield UserLabelSchema.findAll({attributes: ['id', 'name', 'color', 'workspace_id'], where: where});
    }
    return rows.map((row) => {
      row.color = Utils.transformColors(row.color);
      return row;
    });
  }

  static * createLabels(userId, workspaceId) {
    let ws = yield Workspaces.exists(userId, workspaceId);
    if (!ws) {
      throw new ZSError('error_not_found', 404, 'Workspace not found');
    }
    return yield UserLabelSchema.bulkCreate(defaultLabels.map((item) => {
      return {name: item.name, color: item.color, user_id: userId, workspace_id: workspaceId};
    }))
  }

  static * deleteLabels(userId, workspaceId) {
    return yield UserLabelSchema.destroy({where: {user_id: userId, workspace_id: workspaceId}});
  }

  static * deleteLabel(userId, workspaceId, labelId) {
    return yield UserLabelSchema.destroy({where: {user_id: userId, workspace_id: workspaceId, id: labelId}});
  }

  static * saveLabels(userId, workspaceId, array) {
    let ws = yield Workspaces.exists(userId, workspaceId);
    if (!ws) {
      throw new ZSError('error_not_found', 404, 'Workspace not found');
    }
    return yield array.map((label) => {
      return Publisher.saveLabel(userId, workspaceId, label);
    })
  }

  static * saveLabel(userId, workspaceId, label) {
    let row;
    label.color = Utils.transformColors(label.color);
    if (!label.id && label.name !== '') {
      row = UserLabelSchema.create({user_id: userId, workspace_id: workspaceId, name: label.name, color: label.color});
    } else {
      row = yield UserLabelSchema.findOne({where: {id: label.id}});
      if (row) {
        if (label.name === '') {
          row = row.destroy();
        } else {
          row.name = label.name;
          row.color = label.color;
          row = row.save();
        }
      } else {
        row = Promise.resolve();
      }
    }
    return yield row;
  }

  static * listPosts(moduleId, from, to) {
    let module = yield ModulesSchema.findOne({where: {id: moduleId}});

    let posts = yield db.query(
      ' SELECT sc.id, sc.message, sc.date_publish, sc.date_send, st.id statusId, st.name statusName, st.color statusColor, st.bgcolor statusBgColor, l.id labelId, IFNULL(l.name, "") labelName, IFNULL(l.color, "") labelColor' +
      ' FROM postbox_schedule sc' +
      ' JOIN postbox_status st ON st.id = sc.status_id' +
      ' LEFT JOIN user_label_outgoing l ON l.id = sc.label_id' +
      ' WHERE st.workspace_id = $workspaceId AND st.user_id = $userId AND date_publish BETWEEN FROM_UNIXTIME($from) AND FROM_UNIXTIME($to)' +
      ' ORDER BY date_publish ASC', {
        bind: {userId: module.user_id, workspaceId: module.workspace_id, from: from, to: to},
        type: sequelize.QueryTypes.SELECT
      });

    return posts.map((post) => {
      let msg = JSON.parse(post.message);

      return {
        id: post.id,
        date_publish: post.date_publish,
        date_send: post.date_send,
        message: {
          attachment: Replace.replaceHttp(msg.attachment),
          attachment_description: msg.attachment_description,
          link_image: msg.link_image,
          link_summary: msg.link_summary,
          link_title: msg.link_title,
          source: msg.source,
          response: msg.response,
          message: msg.message
        },
        status: {
          id: post.statusId,
          name: post.statusName,
          color: Utils.transformColors(post.statusColor),
          backgroundColor: Utils.transformColors(post.statusBgColor)
        },
        label: {
          id: post.labelId,
          name: post.labelName,
          color: Utils.transformColors(post.labelColor)
        }
      };
    });
  }

  static * listWorkspaceStatuses(workspaceId, masterId) {
    if (workspaceId === 0) {
      workspaceId = null;
    }
    let statuses = yield StatusSchema.findAll({
      attributes: ['id', 'name', 'color', 'access_read', 'access_write', 'publish', 'bgcolor', 'sent'],
      where: {user_id: masterId, workspace_id: workspaceId}
    });
    if (!statuses[0]) {
      yield Publisher.createStatuses(masterId, workspaceId);
      statuses = yield StatusSchema.findAll({
        attributes: ['id', 'name', 'color', 'access_read', 'access_write', 'publish', 'bgcolor', 'sent'],
        where: {user_id: masterId, workspace_id: workspaceId}
      });
    }
    return statuses.map((status) => {
      status.color = Utils.transformColors(status.color);
      status.bgcolor = Utils.transformColors(status.bgcolor);
      return status;
    });
  }

  static * createStatuses(userId, workspaceId) {
    let ws = yield Workspaces.exists(userId, workspaceId);
    if (!ws) {
      throw new ZSError('error_not_found', 404, 'Workspace not found');
    }
    return yield StatusSchema.bulkCreate(defaultStatuses.map((item) => {
      return {
        name: item.name,
        color: item.color,
        access_read: item.access_read,
        access_write: item.access_write || '',
        publish: item.publish,
        bgcolor: item.bgcolor,
        sent: item.sent || false,
        user_id: userId,
        workspace_id: workspaceId
      };
    }))
  }

  static * listLabelsInWorkspace(userId, workspaceId) {
    let where = {user_id: userId, workspace_id: workspaceId == 0 ? null : workspaceId};
    let rows = yield UserLabelSchema.findAll({attributes: ['id', 'name', 'color'], where: where});
    if (!rows[0]) {
      yield Publisher.createLabels(userId, workspaceId == 0 ? null : workspaceId);
      rows = yield UserLabelSchema.findAll({attributes: ['id', 'name', 'color'], where: where});
    }
    return rows.map((row) => {
      row.color = Utils.transformColors(row.color);
      return row;
    });
  }

  static * listUserLabelsWithoutId(userId) {
    let rows = yield UserLabelSchema.findAll({attributes: ['id', 'name', 'color', 'workspace_id'], where: {user_id: userId}});
    return rows.map((row) => {
      row.color = Utils.transformColors(row.color);
      row.workspace_id = row.workspace_id || 0;
      return row;
    });
  }

  static * publisherStatuses(userId) {
    let statuses = yield StatusSchema.findAll({
      attributes: ['id', 'name', 'color', 'access_read', 'access_write', 'publish', 'bgcolor', 'sent', 'workspace_id'],
      where: {user_id: userId}
    });
    return statuses.map((status) => {
      status.color = Utils.transformColors(status.color);
      status.bgcolor = Utils.transformColors(status.bgcolor);
      status.workspace_id = status.workspace_id || 0;
      return status;
    });
  }
}

module.exports = Publisher;
