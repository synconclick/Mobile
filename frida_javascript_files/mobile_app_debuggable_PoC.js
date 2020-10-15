Java.perform(function() {
    var System = Java.use('java.lang.System');
    var ActivityThread = Java.use("android.app.ActivityThread");
    var AlertDialogBuilder = Java.use("android.app.AlertDialog$Builder");
    var DialogInterfaceOnClickListener = Java.use('android.content.DialogInterface$OnClickListener');

    Java.use("android.app.Activity").onCreate.overload("android.os.Bundle").implementation = function(savedInstanceState) {
        var currentActivity = this;

        // Get Main Activity
        var application = ActivityThread.currentApplication();
        var launcherIntent = application.getPackageManager().getLaunchIntentForPackage(application.getPackageName());
        var launchActivityInfo = launcherIntent.resolveActivityInfo(application.getPackageManager(), 0);

        // Alert Will Only Execute On Main Package Activity Creation
        if (launchActivityInfo.name.value === this.getComponentName().getClassName()) {
            var alert = AlertDialogBuilder.$new(this);
            alert.setMessage("PoC indicating app is debuggable... Pick one:");

            alert.setPositiveButton("Pay $50", Java.registerClass({
                name: 'il.co.realgame.OnClickListenerPositive',
                implements: [DialogInterfaceOnClickListener],
                methods: {
                    getName: function() {
                        return 'OnClickListenerPositive';
                    },
                    onClick: function(dialog, which) {
                        // Dismiss
                        dialog.dismiss();
                    }
                }
            }).$new());

            alert.setNegativeButton("Get hacked for life", Java.registerClass({
                name: 'il.co.realgame.OnClickListenerNegative',
                implements: [DialogInterfaceOnClickListener],
                methods: {
                    getName: function() {
                        return 'OnClickListenerNegative';
                    },
                    onClick: function(dialog, which) {
                        // Close Application
                        currentActivity.finish();
                        System.exit(0);
                    }
                }
            }).$new());

            // Create Alert
            alert.create().show();
        }
        return this.onCreate.overload("android.os.Bundle").call(this, savedInstanceState);
    };
});