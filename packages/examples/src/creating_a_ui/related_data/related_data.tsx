import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ModelManager } from 'rev-models';
import { ModelApiBackend } from 'rev-api-client';
import { ModelProvider, ListView } from 'rev-ui';
import * as models from '../models';

import Reboot from 'material-ui/Reboot';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Card from 'material-ui/Card';

import { registerComponents } from 'rev-ui-materialui';
registerComponents();

export const modelManager = new ModelManager();
modelManager.registerBackend('default', new ModelApiBackend('http://localhost:3000/graphql'));
modelManager.register(models.User);
modelManager.register(models.Post);
modelManager.register(models.Comment);

ReactDOM.render((
        <ModelProvider modelManager={modelManager} >
            <Reboot />
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="title" color="inherit">
                        RevJS - Related Model Data Demo
                    </Typography>
                </Toolbar>
            </AppBar>
            <Card style={{ maxWidth: 800, margin: '30px auto' }}>

                <ListView
                    title="Current Posts"
                    model="Post"
                    fields={[
                        'post_date',
                        'title',
                        'description',
                        'user',
                        'number_of_comments',
                    ]}
                    related={[
                        'user',
                        'comments'
                    ]}
                    where={{
                        post_date: { _gt: '2017-01-01' }
                    }}
                    orderBy={['post_date desc']}
                    limit={5}
                />

            </Card>
        </ModelProvider>
    ),
    document.getElementById('app')
);
